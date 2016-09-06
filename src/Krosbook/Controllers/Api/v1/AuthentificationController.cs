using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Krosbook.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Authentication;
using System.Security.Claims;
using Krosbook.ViewModels.Users;
using Microsoft.AspNetCore.Cors;
using System.Linq;
using System.Net;
using Krosbook.Filters;
using Krosbook.Models;
using Microsoft.AspNetCore.Identity;
using Krosbook.Services.Email;

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
        private IRememberMeRepository _rememberMeRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private IEmailService _emailService;
        #endregion


        #region Constructors
        public AuthenticationController(IUserRepository userRepository, IRoleRepository roleRepository, ILogger<AuthenticationController> logger,
            IRememberMeRepository rememberMeRepository, UserManager<ApplicationUser> userManager, IEmailService emailService)
        {
            _userRepository = userRepository;
            _logger = logger;
            _roleRepository = roleRepository;
            _rememberMeRepository = rememberMeRepository;
            _userManager = userManager;
            _emailService = emailService;
        }
        #endregion


        #region Api        


        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel user)
        {
            if (user.RememberMe)
                return await SignInCoreEmailCookie(user.Email, user.Password, user.Selector, user.Validator);
            else return await SignInCore(user.Email, user.Password);
        }

        [HttpPost]
        [Route("loginWithCookie")]
        public async Task<IActionResult> LoginWithCookie([FromBody] LoginCookieViewModel user)
        {
            return await SignInCoreCookie(user.Selector, user.Validator);
        }


        [HttpGet("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var user = _userRepository.GetItem(GetUserId());
            var rememberMe = _rememberMeRepository.GetSingleByUserId(user.Id);
            if (rememberMe != null && rememberMe.Selector != null)
            {
                var remember = _rememberMeRepository.GetSingleByUserId(user.Id);
                _rememberMeRepository.Delete(remember);
                _rememberMeRepository.Save();
            }
            await HttpContext.Authentication.SignOutAsync(Startup.AuthenticationScheme);
            return Ok();
        }


        [HttpGet("isLoggedIn")]
        public IActionResult IsLoggedIn()
        {
            var claims = User.Claims.Count();
            if (claims != 0)
            {
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Route("forgottenPassword")]
        //    [ValidateModelState, CheckArgumentsForNull]
        public IActionResult ForgottenPassword([FromBody] ForgotPasswordViewModel passwordVM)
        {
            var user = _userRepository.GetSingleByEmail(passwordVM.Email);
            if (user != null)
            {
                var token = this.GenerateRandomToken();

                user.ResetPasswordToken = token;
                user.ResetPasswordDateTime = System.DateTime.Now;
                _userRepository.EditWithoutRoles(user);
                _userRepository.Save();

                _emailService.SendPasswordReset(passwordVM.Email, token);
                return Ok();
            }
            //nieco sa pokaslalo
            return BadRequest();
        }

        [HttpPut]
        [Route("setForgottenPassword")]
        //    [ValidateModelState, CheckArgumentsForNull]
        public IActionResult SetForgottenPassword([FromBody] ForgotPasswordSetViewModel passwordVM)
        {
            var user = _userRepository.GetSingleByToken(passwordVM.token);
            System.DateTime now = System.DateTime.Now;
            if (user != null)
            {
                if (now >= user.ResetPasswordDateTime && now <= user.ResetPasswordDateTime.AddMinutes(30))
                {
                    user.Password = passwordVM.newPassword;
                    user.ResetPasswordToken = null;

                    _userRepository.EditWithoutRoles(user);
                    _userRepository.Save();

                    return Ok();
                }

                else return BadRequest();
            }
            //nieco sa pokaslalo
            return BadRequest();
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
            return NotFound();
        }

        private async Task<IActionResult> SignInCoreEmailCookie(string email, string password, string selector, string validator)
        {
            User user = null;
            var resultSignIn = PasswordSignIn(email, password, out user);
            if (resultSignIn.Succeeded)
            {
                RememberMe rem = new RememberMe();
                rem.Selector = selector;
                rem.Validator = validator;
                rem.userId = user.Id;
                // rem.
                _rememberMeRepository.Add(rem);
                _rememberMeRepository.Save();
                await HttpContext.Authentication.SignInAsync(Startup.AuthenticationScheme, CreatePrincipal(user));
                return Ok();
            }
            return NotFound();
        }

        private async Task<IActionResult> SignInCoreCookie(string selector, string validator)
        {
            User user = null;
            var resultSignIn = SelectorSignIn(selector, validator, out user);
            if (resultSignIn.Succeeded)
            {
                await HttpContext.Authentication.SignInAsync(Startup.AuthenticationScheme, CreatePrincipal(user));
                return Ok();
            }
            return NotFound();
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

        private Microsoft.AspNetCore.Identity.SignInResult SelectorSignIn(string selector, string validator, out User user)
        {
            user = _userRepository.GetItem(_rememberMeRepository.GetSingleBySelector(selector).userId);

            if (user != null)
            {
                if (BCrypt.Net.BCrypt.Verify(validator, _rememberMeRepository.GetSingleByUserId(user.Id).ValidatorHash))
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

        private int GetUserId()
        {
            var claims = User.Claims.Select(claim => new { claim.Type, claim.Value }).ToArray();
            var userId = claims[0].Value;
            int id;
            int.TryParse(userId, out id);
            return id;
        }

        private string GenerateRandomToken()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var stringChars = new char[20];
            var random = new System.Random();

            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            return new System.String(stringChars);
        }
        #endregion
    }
}
