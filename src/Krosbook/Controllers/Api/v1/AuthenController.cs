using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Krosbook.Models.Users;
using Krosbook.ViewModels.Users;
using System.Security.Claims;
using Microsoft.Extensions.Logging;



namespace Krosbook.Controllers.Api.v1
{
    [Route("api/authenticate")]
    public class AuthenController : BaseController
    {
        public const string ClaimTypeId = "Id";
        private const string AuthenticationScheme = "KrosbookAuthentication";

        private readonly IUserRepository _userRepository;
        private ILogger<AuthenController> _logger;


        public AuthenController(IUserRepository userRepository, ILogger<AuthenController> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        [HttpGet]
        [Route("test")]
        public IActionResult GetById()
        {
            return new ObjectResult("Hura");
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login5([FromBody] LoginViewModel user)
        {     
            return await SignInCore(user.Email, user.Password);
        }



        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.Authentication.SignOutAsync(Startup.AuthenticationScheme);
            return Ok();
        }


        




        private async Task<IActionResult> SignInCore(string email, string password)
        {
            User user = null;
            var resultSignIn = PasswordSignIn(email, password, out user);
            if (resultSignIn.Succeeded)
            {
                await HttpContext.Authentication.SignInAsync(Startup.AuthenticationScheme, CreatePrincipal(user));
                return Ok();
            }
            return Unauthorized();
        }


        private Microsoft.AspNetCore.Identity.SignInResult PasswordSignIn(string email, string password, out User user)
        {
            user = _userRepository.GetSingleByEmail(email);
            if (user != null)
            {
                if (BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                {
                    return Microsoft.AspNetCore.Identity.SignInResult.Success;
                }
            }
            return Microsoft.AspNetCore.Identity.SignInResult.Failed;
        }


        private ClaimsPrincipal CreatePrincipal(User user)
        {
            var claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypeId, user.Id.ToString(), ClaimValueTypes.Integer32));
            return new ClaimsPrincipal(new ClaimsIdentity(claims, Startup.AuthenticationScheme));
        }

    }
}