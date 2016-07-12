using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Krosbook.Models.Users;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Krosbook.ViewModels.Users;
using Microsoft.AspNetCore.Cors;

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

            #endregion


            #region Constructors

            public AuthenticationController(IUserRepository userRepository, ILogger<AuthenticationController> logger)
            {
                _userRepository = userRepository;
                _logger = logger;
            }

            #endregion


            #region Api
           
         

           // [Authorize]
            [HttpGet]        
            public IActionResult Test2()
            {
                return new ObjectResult("Huraaa");
            }

            [HttpGet]          
            public async Task<IActionResult> Login(string userName, string password)
            {
                return await SignInCore(userName, password);
            }


        [EnableCors("AllowAll")]
        [HttpPost]
            [Route("login")]
            public async Task<IActionResult> Login([FromBody] LoginViewModel user)
            {
                return await SignInCore(user.Email, user.Password);
            }


            [HttpGet("logout")]
            public async Task<IActionResult> Logout()
            {
                await HttpContext.Authentication.SignOutAsync(Startup.AuthenticationScheme);
                return Ok();
            }

            #endregion


            #region Helpers

            private async Task<IActionResult> SignInCore(string userName, string password)
            {
                User user = null;
                var resultSignIn = PasswordSignIn(userName, password, out user);
                if (resultSignIn.Succeeded)
                {
                    await HttpContext.Authentication.SignInAsync(Startup.AuthenticationScheme, CreatePrincipal(user));
                    return Ok();
                }
                return Unauthorized();
            }


            private Microsoft.AspNetCore.Identity.SignInResult PasswordSignIn(string userName, string password, out User user)
            {
                user = _userRepository.GetSingleByUsername(userName);
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
           

            #endregion
        }
    }
