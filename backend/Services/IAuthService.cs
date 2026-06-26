using VmsBackend.Models.DTOs;

namespace VmsBackend.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request, string? ipAddress, string? userAgent);
    Task LogoutAsync(string token);
    Task<LoginResponse> RefreshAsync(string token);
}
