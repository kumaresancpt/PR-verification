namespace VmsBackend.Services;

public interface IAuditService
{
    Task LogAsync(string eventType, string username, string? ipAddress, string? userAgent, string result);
}
