using VmsBackend.Data;
using VmsBackend.Models;

namespace VmsBackend.Services;

public class AuditService : IAuditService
{
    private readonly AppDbContext _db;

    public AuditService(AppDbContext db)
    {
        _db = db;
    }

    public async Task LogAsync(string eventType, string username, string? ipAddress, string? userAgent, string result)
    {
        _db.AuditLogs.Add(new AuditLog
        {
            EventType = eventType,
            Username = username,
            IPAddress = ipAddress,
            UserAgent = userAgent,
            Timestamp = DateTime.UtcNow,
            Result = result
        });
        await _db.SaveChangesAsync();
    }
}
