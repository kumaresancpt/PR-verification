using Microsoft.EntityFrameworkCore;
using VmsBackend.Models;

namespace VmsBackend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
    public DbSet<PasswordHistory> PasswordHistories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.Property(u => u.Email).IsRequired().HasMaxLength(256);
            e.Property(u => u.Role).IsRequired().HasMaxLength(50);
            e.Property(u => u.PasswordHash).IsRequired();
            e.HasIndex(u => u.Email).IsUnique();
            e.ToTable("users");
        });

        modelBuilder.Entity<AuditLog>(e =>
        {
            e.HasKey(a => a.Id);
            e.Property(a => a.EventType).IsRequired().HasMaxLength(100);
            e.Property(a => a.Username).IsRequired().HasMaxLength(256);
            e.Property(a => a.Result).IsRequired().HasMaxLength(50);
            e.ToTable("audit_logs");
        });

        modelBuilder.Entity<PasswordResetToken>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasOne(p => p.User).WithMany().HasForeignKey(p => p.UserId)
             .OnDelete(DeleteBehavior.Cascade);
            e.ToTable("password_reset_tokens");
        });

        modelBuilder.Entity<PasswordHistory>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasOne(p => p.User).WithMany().HasForeignKey(p => p.UserId)
             .OnDelete(DeleteBehavior.Cascade);
            e.ToTable("password_histories");
        });
    }
}
