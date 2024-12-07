using ASP_Server.Models;
using ASP_Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ASP_Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> signInManager;
        private readonly JWTService jWTService;
        private readonly ILogger<AuthenticationController> logger;


        public AuthenticationController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            JWTService jWTService,
            ILogger<AuthenticationController> logger)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.jWTService = jWTService;
            this.logger = logger;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            logger.LogInformation($"Recieved Data: {model}");

            if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
                return Unauthorized();

            var user = await userManager.FindByEmailAsync(model.Email);

            if (user is null)
                return Unauthorized();

            var res = await signInManager.PasswordSignInAsync(user, model.Password, false, false);

            if (!res.Succeeded)
                return Unauthorized();

            return Ok(new { Token = jWTService.GenerateJwtToken(user), UserName = user.UserName });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            logger.LogInformation($"Recieved Data: {model}");

            if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password) || string.IsNullOrWhiteSpace(model.UserName))
                return Unauthorized();

            var user = await userManager.FindByEmailAsync(model.Email);

            if (user is not null)
                return BadRequest();

            user = await userManager.FindByNameAsync(model.UserName);

            if (user is not null)
                return BadRequest();

            var res = await userManager.CreateAsync(new IdentityUser
            {
                UserName = model.UserName,
                Email = model.Email
            }, model.Password);

            if (!res.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError);

            user = (await userManager.FindByEmailAsync(model.Email))!;

            return Ok(new { Token = jWTService.GenerateJwtToken(user), UserName = user.UserName });
        }
    }
}
