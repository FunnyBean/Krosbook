using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System;
using Krosbook.Filters;
using Microsoft.Extensions.Logging;
using Krosbook.Models.Users;
using Krosbook.ViewModels.Users;
using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Krosbook.Models.Cars;
using Krosbook.ViewModels.Cars;
using Krosbook.Models.Reservation;
using Krosbook.ViewModels.Rooms;
using Krosbook.ViewModels.Reservation;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Krosbook.Services.Email;

namespace Krosbook.Controllers.Api.v1
{
    [Route("api/reservations/cars")]
    [EnableCors("AllowAll")]
    [Authorize]
    public class CarReservationController : BaseController
    {
        #region Private Fields
        private ICarReservationRepository _reservationRepository;
        private ILogger<CarReservationController> _logger;
        private IMapper _mapper;
        private IEmailService _emailService;
        #endregion

        #region Constructor
        public CarReservationController(ICarReservationRepository reservationRepository,
                      ILogger<CarReservationController> logger,
                      IMapper mapper, IEmailService emailService)
        {
            _reservationRepository = reservationRepository;
            _logger = logger;
            _mapper = mapper;
            _emailService = emailService;
        }
        #endregion


        #region API
        [HttpGet]        
        public IEnumerable<CarReservationViewModel> GetAllCarReservations()
        {
            return _mapper.Map<IEnumerable<CarReservationViewModel>>(_reservationRepository.GetAll());
        }

        [HttpGet("byState/{reservationState}")]
        public IEnumerable<CarReservationViewModel> GetAllCarReservationsByState(int reservationState)
        {
            return _mapper.Map<IEnumerable<CarReservationViewModel>>(_reservationRepository.GetReservationsByState(reservationState));
        }

        [HttpGet("byLoggedInUser")]
        public IEnumerable<CarReservationViewModel> GetAllCarReservationByLoggedUser()
        {
            return _mapper.Map<IEnumerable<CarReservationViewModel>>(_reservationRepository.GetReservationsCarByUser(GetUserId()));
        }


        [HttpPost("byCar/{carId}")]
        public IEnumerable<CarReservationViewModel> GetReservationByCar([FromBody] CarReservationIntervalViewModel reservation, int carId)
        {
            return _mapper.Map<IEnumerable<CarReservationViewModel>>(_reservationRepository.GetReservationsByCarInTimeInterval(carId, DateTime.ParseExact(reservation.from, "dd.MM.yyyy", System.Globalization.CultureInfo.InvariantCulture), DateTime.ParseExact(reservation.to, "dd.MM.yyyy", System.Globalization.CultureInfo.InvariantCulture)));
        }

        [HttpGet("{reservationId}")]
        public IActionResult GetReservationById(int reservationId)
        {
            var reservation = _reservationRepository.GetItem(reservationId);
            if (reservation == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }
            if (!User.IsInRole("Prevadzkar"))
            {
                if (reservation.UserId != GetUserId())
                {
                    var message = $"User with id " + GetUserId() + " can't update reservation, that was created by user with id " + reservation.UserId;
                    _logger.LogWarning(message);
                    this.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return this.Json(new { Message = message });
                }
            }
            return this.Json(_mapper.Map<CarReservationViewModel>(reservation));
        }

        [HttpPost()]
        [ValidateModelState, CheckArgumentsForNull]
        public IActionResult CreateNewCarReservation([FromBody] CarReservationViewModel reservationVm)
        {
            reservationVm.DateTimeStart = DateTime.ParseExact(reservationVm.dateStart, "dd.MM.yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture);
            reservationVm.DateTimeEnd = DateTime.ParseExact(reservationVm.dateEnd, "dd.MM.yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture);
            return this.CreateNewReservation(reservationVm);
        }


        [HttpPut("{reservationId}")]
        [ValidateModelState, CheckArgumentsForNull]    
        public IActionResult UpdateReservation(int reservationId, [FromBody] CarReservationViewModel reservationVm)
        {
            if (!User.IsInRole("Prevadzkar"))
            {
                if (reservationVm.UserId != GetUserId() || reservationVm.ReservationState != 1)
                {
                    var message = $"User with id " + GetUserId() + " can't update reservation, that was created by user with id " + reservationVm.UserId;
                    _logger.LogWarning(message);
                    this.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return this.Json(new { Message = message });
                }
            }
          
            if (reservationVm.Id != reservationId)
            {
                var message = $"Invalid argument. Id '{reservationId}' and userVm.Id '{reservationVm.Id}' are not equal.";
                _logger.LogWarning(message);

                this.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return this.Json(new { Message = message });
            }
            reservationVm.DateTimeStart = DateTime.ParseExact(reservationVm.dateStart, "dd.MM.yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture);
            reservationVm.DateTimeEnd = DateTime.ParseExact(reservationVm.dateEnd, "dd.MM.yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture);
            CarReservation oldReservation = _reservationRepository.GetItem(reservationId);
            if (oldReservation == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }
            IActionResult result;
            CarReservation editedReservation = _mapper.Map(reservationVm, oldReservation);
            result = SaveData(() =>
            {
                _reservationRepository.Edit(editedReservation);
            });
            return result;
        }

        [HttpPut("approve/{reservationId}")]
        public IActionResult ApproveReservation(int reservationId)
        {
            if(User.IsInRole("Prevadzkar"))
            {
                CarReservation reservation = _reservationRepository.GetItem(reservationId);
                if(reservation == null)
                {
                    this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    return this.Json(null);
                }
                IActionResult result;
                reservation.ReservationState = 2;
                result = SaveData(() =>
                {
                    _reservationRepository.Edit(reservation);
                    _emailService.SendCarReservation(reservation);
                });
                return result;
            }
            else
            {
                this.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return this.Json(null);
            } 
        }



        [HttpDelete("{reservationId}")]
        public IActionResult DeleteReservation(int reservationId)
        {
            if (!User.IsInRole("Prevadzkar"))
            {
                CarReservation oldReservation = _reservationRepository.GetItem(reservationId);
                if (oldReservation.UserId != GetUserId() || oldReservation.ReservationState != 1)
                {
                    var message = $"User with id " + GetUserId() + " can't delete reservation, that was created by user with id " + _reservationRepository.GetItem(reservationId).UserId;
                    _logger.LogWarning(message);
                    this.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return this.Json(new { Message = message });
                }
            }
            return SaveData(() =>
            {
                _reservationRepository.Delete(reservationId);
            });
        }

        [HttpDelete("safe/{reservationId}")]
        public IActionResult AskForSafeDeleteReservation(int reservationId)
        {
            CarReservation reservation = _reservationRepository.GetItem(reservationId);
            if (reservation == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }
            IActionResult result;
            reservation.ReservationState = 3;
            result = SaveData(() =>
            {
                _reservationRepository.Edit(reservation);
            });
            return result;
        }

        #endregion




        #region Helpers

        private IActionResult CreateNewReservation(CarReservationViewModel reservationVm)
        {
            reservationVm.UserId = GetUserId();
            CarReservation reservation = _mapper.Map<CarReservation>(reservationVm);
            return SaveData(() =>
            {
                _reservationRepository.Add(reservation);
            },
            () =>
            {
                this.Response.StatusCode = (int)HttpStatusCode.Created;

                return this.Json(new JsonResult(this.Json(_mapper.Map<CarReservationViewModel>(reservation)))
                {
                    StatusCode = this.Response.StatusCode
                });
            });
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
                _reservationRepository.Save();

                return result();
            }
            catch (Exception ex)
            {
                _logger.LogError("Exception occured when saving data.", ex);
                this.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return this.Json(new { Message = $"Saving data throw Exception '{ex.Message}'" });
            }
        }


        public int GetUserId()
        {
            var claims = User.Claims.Select(claim => new { claim.Type, claim.Value}).ToArray();
            var userId = claims[0].Value;
            int id;
            int.TryParse(userId, out id);
            return id;
        }

        #endregion

    }
}
