using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASP_Server.Controllers
{
    [ApiController]
    [Route("/api/auth")]
    public class AuthenticationController : ControllerBase
    {
        [AllowAnonymous]
        [HttpPost]
        [Route("/login")]
        public async Task<JsonResult> Login()
        {
            return null;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/register")]
        public async Task<JsonResult> Register()
        {
            return null;
        }
    }
}
