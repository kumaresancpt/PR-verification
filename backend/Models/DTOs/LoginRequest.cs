using System.ComponentModel.DataAnnotations;

namespace VmsBackend.Models.DTOs;

public class LoginRequest
{
    [Required(ErrorMessage = "Username is required.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role is required.")]
    public string Role { get; set; } = string.Empty;

    public bool KeepLoggedIn { get; set; }
}
