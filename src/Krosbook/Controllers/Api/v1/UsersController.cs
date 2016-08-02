using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using System;
using Krosbook.Filters;
using Microsoft.Extensions.Logging;
using Krosbook.Models.Users;
using Krosbook.ViewModels.Users;
using Krosbook.Models;
using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.IdentityModel.Claims;

namespace Krosbook.Controllers.Api.v1    
{
    [Route("api/users")]
    [EnableCors("AllowAll")]
    [Authorize]
    public class UsersController : BaseController
    {
        #region Private Fields

        private IUserRepository _userRepository;
        private ILogger<UsersController> _logger;
        private IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;


        #endregion

        #region Constructor
        public UsersController(
            IUserRepository userRepository,                      
            ILogger<UsersController> logger,                                       
            IMapper mapper,                                         
            UserManager<ApplicationUser> userManager, 
            SignInManager<ApplicationUser> signInManager)
        {
            _userRepository = userRepository;
            _logger = logger;
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        #endregion


        #region API
        [HttpGet]
        public IEnumerable<UserViewModel> Get()
        {            
            return _mapper.Map<IEnumerable<UserViewModel>>(_userRepository.GetAll());
        }

        [Authorize(Roles = "Admin")]
        [HttpPost()]
        [ValidateModelState, CheckArgumentsForNull]
        public IActionResult PostNewUser([FromBody] UserViewModel userVm)
        {
            return this.CreateNewUser(userVm);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("BulkInsert")]
        [ValidateModelState, CheckArgumentsForNull]
        public IEnumerable<IActionResult> PostNewUserByBulkInsert([FromBody] IEnumerable<UserViewModel> userVms)
        {
            List<IActionResult> result = new List<IActionResult>();
            foreach (UserViewModel item in userVms)
            {
                JsonResult ret = (JsonResult)this.CreateNewUser(item);
                ret.StatusCode = ((dynamic)ret.Value).StatusCode;
                result.Add(ret);
            }

            return result;
        }

  
        [HttpGet("{userId}")]
        public IActionResult GetUserById(int userId)
        {
            var user = _userRepository.GetItem(userId);  
            if (user == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }
            else
            {
                return this.Json(_mapper.Map<UserViewModel>(user));
            }
        }


        [HttpGet("profile")]        
        public IActionResult GetUserProfile()
        {
             var user = _userRepository.GetItem(GetUserId());  
            if (user == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }
            else
            {
                return this.Json(_mapper.Map<UserViewModel>(user));
            }
        }
        

        [HttpPut("{userId}")]
        [ValidateModelState, CheckArgumentsForNull]
        public IActionResult UpdateUser(int userId, [FromBody] UserViewModel userVm)
        {
            if (userVm.Id != userId)
            {
                var message = $"Invalid argument. Id '{userId}' and userVm.Id '{userVm.Id}' are not equal.";
                _logger.LogWarning(message);

                this.Response.StatusCode = (int) HttpStatusCode.BadRequest;
                return this.Json(new { Message = message });
            }

            User oldUser = _userRepository.GetItem(userId);
            if (oldUser == null)
            {
                this.Response.StatusCode = (int) HttpStatusCode.NotFound;
                return this.Json(null);
            }

            if (ExistAnotherUserWithEmail(userVm.Email, userId))
            {
                this.Response.StatusCode = (int) HttpStatusCode.BadRequest;
                return this.Json(new { Message = $"User with email '{userVm.Email}' already exist." });
            }
            else
            {
                IActionResult result;
                User editedUser = _mapper.Map(userVm, oldUser);

                result = SaveData(() =>
                {
                    _userRepository.Edit(editedUser);
                });
                return result;
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{userId}")]
        public IActionResult DeleteUser(int userId)
        {
            return SaveData(() =>
            {
                _userRepository.Delete(userId);
            });
        }

        #endregion

        #region Helpers

        private IActionResult CreateNewUser(UserViewModel userVm)
        {
            if (_userRepository.GetItem(u => u.Email == userVm.Email) == null)
            {
                User user = _mapper.Map<User>(userVm);
                user.DateCreated = DateTime.Now;

                if (userVm.Photo != null)
                {
                    user.Photo = userVm.Photo;
                }
                else
                {
                    user.Photo = DbInitializer.GetDefaultAvatar();
                }
                user.Password = "12545454";

                return SaveData(() =>
                {
                    _userRepository.Add(user);
                },
                () =>
                {
                    this.Response.StatusCode = (int)HttpStatusCode.Created;

                    return this.Json(new JsonResult(this.Json(_mapper.Map<UserViewModel>(user)))
                    {
                        StatusCode = this.Response.StatusCode
                    });
                });
            }
            else
            {
                this.Response.StatusCode = (int)HttpStatusCode.BadRequest;

                return this.Json(new JsonResult($"User with email '{userVm.Email}' already exist.")
                {
                    StatusCode = this.Response.StatusCode
                });
            }
        }


        private bool ExistAnotherUserWithEmail(string userEmail, int userId)
        {
            User user = _userRepository.GetItem(u => u.Email == userEmail);

            return user != null && user.Id != userId;
        }

        private IActionResult SaveData(Action beforeAction)
        {
            return SaveData(beforeAction, () => this.Json(null));
        }

        private IActionResult SaveData(Action beforeAction, Func<IActionResult> result)
        {
            try
            {
                beforeAction();
                _userRepository.Save();

                return result();
            }
            catch (Exception ex)
            {
                _logger.LogError("Exception occured when saving data.", ex);
                this.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
                return this.Json(new { Message = $"Saving data throw Exception '{ex.Message}'" });
            }
        }


        public int GetUserId()
        {
            var claims = User.Claims.Select(claim => new { claim.Type, claim.Value }).ToArray();
            var userId = claims[0].Value;
            int id;
            int.TryParse(userId, out id);
            return id;
        }

        #endregion
    }
}
