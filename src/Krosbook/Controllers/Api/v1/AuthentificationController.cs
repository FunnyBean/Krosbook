using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Krosbook.Models.Users;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Krosbook.ViewModels.Users;
using Microsoft.AspNetCore.Cors;
using System.Linq;

namespace Krosbook.Controllers.Api.v1
{
    [Route("api/authentification")]
    [EnableCors("AllowAll")]
    public class AuthenticationController : BaseController
    {
        #region Constants
        public const string ClaimTypeId = "Id";
        private const string AuthenticationScheme = "KrosbookAuthentication";
        #endregion

        #region Fields
        private readonly IUserRepository _userRepository;
        private ILogger<AuthenticationController> _logger;
        private readonly IRoleRepository _roleRepository;
        #endregion


        #region Constructors
        public AuthenticationController(IUserRepository userRepository, IRoleRepository roleRepository, ILogger<AuthenticationController> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
            _roleRepository = roleRepository;
        }
        #endregion


        #region Api        


        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel user)
        {
            return await SignInCore(user.Email, user.Password);
        }


        [HttpGet("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.Authentication.SignOutAsync(Startup.AuthenticationScheme);
            return Ok();
        }


        [HttpGet("isLoggedIn")]
        [Authorize]
        public IActionResult IsLoggedIn()
        {
            var claims = User.Claims.Count();
            if (claims != 0)
            {
                return Ok();
            }
            else
            {
                return Unauthorized();
            }
        }
        #endregion



        #region Helpers
        private async Task<IActionResult> SignInCore(string Email, string password)
        {
            User user = null;
            var resultSignIn = PasswordSignIn(Email, password, out user);
            if (resultSignIn.Succeeded)
            {
                await HttpContext.Authentication.SignInAsync(Startup.AuthenticationScheme, CreatePrincipal(user));
                return Ok();
            }
            return Unauthorized();
        }


        private Microsoft.AspNetCore.Identity.SignInResult PasswordSignIn(string Email, string password, out User user)
        {
            user = _userRepository.GetSingleByEmail(Email);
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

            var roles = _userRepository.GetUserRolesById(user.Id).ToArray();
            for (int i = 0; i < roles.Length; i++)
            {
                var role = _roleRepository.GetItem(roles[i].Id).Name;
                claims.Add(new Claim(ClaimTypes.Role, role, ClaimValueTypes.String));
            }


            return new ClaimsPrincipal(new ClaimsIdentity(claims, Startup.AuthenticationScheme));
        }
        #endregion
    }
}
