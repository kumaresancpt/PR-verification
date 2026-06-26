namespace VmsBackend.Models;

public class PasswordResetToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string OtpHash { get; set; } = string.Empty;
    public string? ResetToken { get; set; }
    public DateTime ExpiresAt { get; set; }
    public int AttemptsUsed { get; set; }
    public bool IsUsed { get; set; }

    public User? User { get; set; }
}
