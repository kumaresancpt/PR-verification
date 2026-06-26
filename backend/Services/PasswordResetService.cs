using System.Net;
using System.Net.Mail;
using Microsoft.EntityFrameworkCore;
using VmsBackend.Data;
using VmsBackend.Models;
using VmsBackend.Models.DTOs;

namespace VmsBackend.Services;

public class PasswordResetService : IPasswordResetService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly IAuditService _audit;

    public PasswordResetService(AppDbContext db, IConfiguration config, IAuditService audit)
    {
        _db = db;
        _config = config;
        _audit = audit;
    }

    public async Task SendOtpAsync(ForgotPasswordRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null) return; // Prevent email enumeration

        // Rate limit: max 3 pending unexpired OTP tokens (AC-06)
        var pendingCount = await _db.PasswordResetTokens
            .CountAsync(t => t.UserId == user.Id && t.ExpiresAt > DateTime.UtcNow && !t.IsUsed && t.ResetToken == null);

        if (pendingCount >= 3)
            throw new InvalidOperationException("OTP rate limit exceeded. Please wait before requesting a new OTP.");

        var otp = Random.Shared.Next(100000, 999999).ToString();
        var otpHash = BCrypt.Net.BCrypt.HashPassword(otp, workFactor: 12);

        _db.PasswordResetTokens.Add(new PasswordResetToken
        {
            UserId = user.Id,
            OtpHash = otpHash,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10)
        });
        await _db.SaveChangesAsync();

        await SendEmailAsync(
            request.Email,
            "Your VMS One-Time Password",
            $"Your verification code is: {otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.");
    }

    public async Task<string> VerifyOtpAsync(VerifyOtpRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email)
            ?? throw new UnauthorizedAccessException("Invalid OTP.");

        var pendingTokens = await _db.PasswordResetTokens
            .Where(t => t.UserId == user.Id && t.ExpiresAt > DateTime.UtcNow && !t.IsUsed && t.ResetToken == null)
            .OrderByDescending(t => t.ExpiresAt)
            .ToListAsync();

        if (!pendingTokens.Any())
            throw new UnauthorizedAccessException("OTP has expired or is invalid.");

        var matchedToken = pendingTokens.FirstOrDefault(t =>
            t.AttemptsUsed < 3 && BCrypt.Net.BCrypt.Verify(request.Otp, t.OtpHash));

        if (matchedToken == null)
        {
            foreach (var t in pendingTokens) t.AttemptsUsed++;
            await _db.SaveChangesAsync();
            throw new UnauthorizedAccessException("Invalid OTP.");
        }

        // Mark OTP used and issue a short-lived reset token
        matchedToken.IsUsed = true;
        var resetGuid = Guid.NewGuid().ToString("N");
        matchedToken.ResetToken = resetGuid;
        matchedToken.ExpiresAt = DateTime.UtcNow.AddMinutes(15);
        await _db.SaveChangesAsync();

        return resetGuid;
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request, string? ipAddress, string? userAgent)
    {
        if (!IsPasswordStrong(request.NewPassword))
            throw new ArgumentException(
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");

        var resetToken = await _db.PasswordResetTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.ResetToken == request.Token && t.ExpiresAt > DateTime.UtcNow)
            ?? throw new UnauthorizedAccessException("Invalid or expired reset token.");

        var user = resetToken.User!;

        // Password history check — last 5 (AC-07)
        var history = await _db.PasswordHistories
            .Where(h => h.UserId == user.Id)
            .OrderByDescending(h => h.CreatedAt)
            .Take(5)
            .ToListAsync();

        if (history.Any(h => BCrypt.Net.BCrypt.Verify(request.NewPassword, h.PasswordHash)))
            throw new InvalidOperationException("Cannot reuse one of your last 5 passwords.");

        var newHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, workFactor: 12);
        user.PasswordHash = newHash;
        user.UpdatedAt = DateTime.UtcNow;

        _db.PasswordHistories.Add(new PasswordHistory
        {
            UserId = user.Id,
            PasswordHash = newHash
        });

        resetToken.IsUsed = true;
        resetToken.ResetToken = null;

        await _db.SaveChangesAsync();
        await _audit.LogAsync("PASSWORD_RESET", user.Email, ipAddress, userAgent, "success");
    }

    private static bool IsPasswordStrong(string password) =>
        password.Length >= 8
        && password.Any(char.IsUpper)
        && password.Any(char.IsLower)
        && password.Any(char.IsDigit)
        && password.Any(c => !char.IsLetterOrDigit(c));

    private async Task SendEmailAsync(string to, string subject, string body)
    {
        var smtpHost = _config["SmtpSettings:Host"];
        if (string.IsNullOrEmpty(smtpHost) || smtpHost == "PLACEHOLDER") return;

        try
        {
            using var client = new SmtpClient(smtpHost)
            {
                Port = int.Parse(_config["SmtpSettings:Port"] ?? "587"),
                Credentials = new NetworkCredential(
                    _config["SmtpSettings:Username"],
                    _config["SmtpSettings:Password"]),
                EnableSsl = true
            };
            await client.SendMailAsync(
                new MailMessage(_config["SmtpSettings:FromEmail"]!, to, subject, body));
        }
        catch (Exception)
        {
            // SMTP failure does not propagate to caller
        }
    }
}
