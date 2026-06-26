namespace VmsBackend.Models;

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string EventType { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? IPAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string Result { get; set; } = string.Empty;
}
