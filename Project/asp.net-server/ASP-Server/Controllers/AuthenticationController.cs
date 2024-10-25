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

            if(string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
                return Unauthorized();

            var user = await userManager.FindByEmailAsync(model.Email);

            if (user is null)
                return Unauthorized();

            var res = await signInManager.PasswordSignInAsync(user, model.Password, false, false);

            if(!res.Succeeded)
                return Unauthorized();

            return Ok(new { Token = jWTService.GenerateJwtToken(user) });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register()
        {
            //TODO: make the register method

            return null;
        }
    }
}
