using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VmsBackend.Data;
using VmsBackend.Models;
using VmsBackend.Models.DTOs;

namespace VmsBackend.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly IAuditService _audit;

    public AuthService(AppDbContext db, IConfiguration config, IAuditService audit)
    {
        _db = db;
        _config = config;
        _audit = audit;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, string? ipAddress, string? userAgent)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Username);

        // Account lockout check (AC-04)
        if (user?.LockoutUntil.HasValue == true && user.LockoutUntil.Value > DateTime.UtcNow)
        {
            var minutesRemaining = (int)Math.Ceiling((user.LockoutUntil.Value - DateTime.UtcNow).TotalMinutes);
            await _audit.LogAsync("LOGIN_LOCKED", request.Username, ipAddress, userAgent, "locked");
            throw new InvalidOperationException(
                $"Account locked due to too many failed attempts. Try again in {minutesRemaining} minutes.");
        }

        // Credential check (AC-02)
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            if (user != null)
            {
                user.FailedAttemptCount++;
                if (user.FailedAttemptCount >= 5)
                {
                    user.LockoutUntil = DateTime.UtcNow.AddMinutes(15);
                    user.FailedAttemptCount = 0;
                }
                user.UpdatedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
            await _audit.LogAsync("LOGIN_FAILED", request.Username, ipAddress, userAgent, "failed");
            throw new UnauthorizedAccessException("Invalid username or password.");
        }

        // Role validation (AC-03)
        if (!string.Equals(user.Role, request.Role, StringComparison.OrdinalIgnoreCase))
        {
            await _audit.LogAsync("LOGIN_ROLE_MISMATCH", request.Username, ipAddress, userAgent, "failed");
            throw new UnauthorizedAccessException("Invalid username or password.");
        }

        // Reset lockout counters on success
        user.FailedAttemptCount = 0;
        user.LockoutUntil = null;
        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        // 30 days if keepLoggedIn, else configured expiry (AC-08)
        var expiryMinutes = request.KeepLoggedIn
            ? 43200
            : int.Parse(_config["JwtSettings:ExpiryMinutes"] ?? "30");

        var token = GenerateToken(user, expiryMinutes);
        await _audit.LogAsync("LOGIN_SUCCESS", request.Username, ipAddress, userAgent, "success");

        return new LoginResponse
        {
            Token = token,
            Role = user.Role,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes)
        };
    }

    public async Task LogoutAsync(string token)
    {
        await Task.CompletedTask;
    }

    public async Task<LoginResponse> RefreshAsync(string token)
    {
        var principal = ValidateExpiredToken(token);
        if (principal == null)
            throw new UnauthorizedAccessException("Invalid token.");

        var userIdClaim = principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Invalid token.");

        var userId = Guid.Parse(userIdClaim);
        var user = await _db.Users.FindAsync(userId)
            ?? throw new UnauthorizedAccessException("User not found.");

        var expiryMinutes = int.Parse(_config["JwtSettings:ExpiryMinutes"] ?? "30");
        var newToken = GenerateToken(user, expiryMinutes);

        return new LoginResponse
        {
            Token = newToken,
            Role = user.Role,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes)
        };
    }

    private string GenerateToken(User user, int expiryMinutes)
    {
        var secretKey = _config["JwtSettings:SecretKey"]
            ?? throw new InvalidOperationException("JwtSettings:SecretKey not configured");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var jwtToken = new JwtSecurityToken(
            issuer: _config["JwtSettings:Issuer"],
            audience: _config["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(jwtToken);
    }

    private ClaimsPrincipal? ValidateExpiredToken(string token)
    {
        try
        {
            var secretKey = _config["JwtSettings:SecretKey"]
                ?? throw new InvalidOperationException("JwtSettings:SecretKey not configured");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);

            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _config["JwtSettings:Issuer"],
                ValidateAudience = true,
                ValidAudience = _config["JwtSettings:Audience"],
                ValidateLifetime = false
            }, out _);

            return principal;
        }
        catch
        {
            return null;
        }
    }
}
