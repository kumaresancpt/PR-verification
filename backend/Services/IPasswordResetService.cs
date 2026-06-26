using VmsBackend.Models.DTOs;

namespace VmsBackend.Services;

public interface IPasswordResetService
{
    Task SendOtpAsync(ForgotPasswordRequest request);
    Task<string> VerifyOtpAsync(VerifyOtpRequest request);
    Task ResetPasswordAsync(ResetPasswordRequest request, string? ipAddress, string? userAgent);
}
