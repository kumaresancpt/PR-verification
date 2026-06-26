using System.ComponentModel.DataAnnotations;

namespace VmsBackend.Models.DTOs;

public class ForgotPasswordRequest
{
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Please provide a valid email address.")]
    public string Email { get; set; } = string.Empty;
}
