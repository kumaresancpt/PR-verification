using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VmsBackend.Models.DTOs;
using VmsBackend.Services;

namespace VmsBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IPasswordResetService _passwordResetService;

    public AuthController(IAuthService authService, IPasswordResetService passwordResetService)
    {
        _authService = authService;
        _passwordResetService = passwordResetService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { detail = "Username and password are required." });

        try
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var ua = Request.Headers.UserAgent.ToString();
            var response = await _authService.LoginAsync(request, ip, ua);

            // Set HttpOnly Secure cookie (AC-08)
            Response.Cookies.Append("accessToken", response.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = response.ExpiresAt
            });

            return Ok(response);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("locked"))
        {
            return StatusCode(423, new { detail = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { detail = ex.Message });
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var token = Request.Cookies["accessToken"] ?? string.Empty;
        await _authService.LogoutAsync(token);
        Response.Cookies.Delete("accessToken");
        return Ok(new { message = "Logged out successfully." });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var token = Request.Cookies["accessToken"];
        if (string.IsNullOrEmpty(token))
            return Unauthorized(new { detail = "No session found." });

        try
        {
            var response = await _authService.RefreshAsync(token);

            Response.Cookies.Append("accessToken", response.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = response.ExpiresAt
            });

            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { detail = ex.Message });
        }
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { detail = "Valid email is required." });

        try
        {
            await _passwordResetService.SendOtpAsync(request);
            return Ok(new { message = "If that email exists, an OTP has been sent." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { detail = "Valid email and 6-digit OTP are required." });

        try
        {
            var resetToken = await _passwordResetService.VerifyOtpAsync(request);
            return Ok(new { token = resetToken });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { detail = ex.Message });
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { detail = "Invalid request. Check all fields." });

        try
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var ua = Request.Headers.UserAgent.ToString();
            await _passwordResetService.ResetPasswordAsync(request, ip, ua);

            Response.Cookies.Delete("accessToken");
            return Ok(new { message = "Password reset successfully." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { detail = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }
}
