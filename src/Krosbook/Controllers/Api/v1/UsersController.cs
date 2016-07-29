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
    public class UsersController : BaseController
    {
        #region Private Fields

        private IUserRepository _userRepository;
        private ILogger<UsersController> _logger;
        private IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        #endregion

        /// <summary>
        /// Initializes a new instance of the <see cref="UsersController"/> class.
        /// </summary>
        /// <param name="userRepository">The user repository.</param>
        /// <param name="logger">Logger.</param>
        /// <param name="mapper">Mapper for mapping domain classes to model classes and reverse.</param>
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



        /// <summary>
        /// Gets all users.
        /// </summary>
        /// <returns>All users</returns>
        [HttpGet]
    //    [Authorize]
        //     [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IEnumerable<UserViewModel> Get()
        {            
            return _mapper.Map<IEnumerable<UserViewModel>>(_userRepository.GetAll());
        }

        /// <summary>
        /// Post new user.
        /// </summary>
        /// <param name="userVm">New user.</param>
        /// <returns>Added user.</returns>
        [HttpPost()]
        [ValidateModelState, CheckArgumentsForNull]
  //      [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult Post([FromBody] UserViewModel userVm)
        {
            return this.CreateNewUser(userVm);
        }

        /// <summary>
        /// Create new user.
        /// </summary>
        /// <param name="userVm">New user.</param>
        /// <returns>Info about creating of user.</returns>
        private IActionResult CreateNewUser(UserViewModel userVm)
        {
            if (_userRepository.GetItem(u => u.Email == userVm.Email) == null)
            {
                User user = _mapper.Map<User>(userVm);
                user.DateCreated = DateTime.Now;

                if (userVm.Photo != null)
                {
                    user.Photo = userVm.Photo;
                } else
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

        /// <summary>
        /// Post new users.
        /// </summary>
        /// <param name="userVms">New users.</param>
        /// <returns>Added users.</returns>
        [HttpPost("BulkInsert")]
        [ValidateModelState, CheckArgumentsForNull]
        //[Authorize(Roles = "Administrator")] - ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IEnumerable<IActionResult> Post([FromBody] IEnumerable<UserViewModel> userVms)
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


        /// <summary>
        /// Gets user by id.
        /// </summary>
        /// <returns>user</returns>
        /// 

                [HttpGet("{userId}")]
        //    [Authorize]
        //     [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult GetUser(int userId)
        {
            var user = _userRepository.GetItem(userId);

        //    return _mapper.Map<IEnumerable<UserViewModel>>(_userRepository.GetItem(userId));                    


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
        //    [Authorize]
        //     [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult GetUser()
        {
            /*
            var usr = _userManager.GetUserAsync(HttpContext.User);
            var a = _userManager.GetUserId(User);
            var sign=_signInManager.IsSignedIn(User);

            var userId = User.Claims;
            */
            var user = _userRepository.GetItem(1);
            //    return _mapper.Map<IEnumerable<UserViewModel>>(_userRepository.GetItem(userId));                    


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

        [HttpGet("Id")]
        //    [Authorize]
        //     [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult GetUserId()
        {
            var userId = 1;  //treba zistit id prihlaseneho pouzivatela
            return this.Json(userId);          
        }

        /// <summary>
        /// Update the user.
        /// </summary>
        /// <param name="userId">User id for update.</param>
        /// <param name="userVm">User view model, with new properties.</param>
        /// <returns>Updated user.</returns>
        [HttpPut("{userId}")]
        [ValidateModelState, CheckArgumentsForNull]
        //[Authorize(Roles = "Administrator")] - ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult Put(int userId, [FromBody] UserViewModel userVm)
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

        /// <summary>
        /// Deletes the specified user.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        [HttpDelete("{userId}")]
        //[Authorize(Roles = "Administrator")] - ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult Delete(int userId)
        {
            return SaveData(() =>
            {
                _userRepository.Delete(userId);
            });
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
    }
}
