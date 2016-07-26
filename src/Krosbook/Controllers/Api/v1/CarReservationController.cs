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

namespace Krosbook.Controllers.Api.v1
{
    [Route("api/reservations/cars")]
    [EnableCors("AllowAll")]
    public class CarReservationController : BaseController
    {
        #region Private Fields

        private ICarReservationRepository _reservationRepository;
        private ILogger<CarReservationController> _logger;
        private IMapper _mapper;

        #endregion

        /// <summary>
        /// Initializes a new instance of the <see cref="RoomReservationCCarReservationControllerontroller"/> class.
        /// </summary>
        /// <param name="carsRepository">The car repository.</param>
        /// <param name="logger">Logger.</param>
        /// <param name="mapper">Mapper for mapping domain classes to model classes and reverse.</param>
        public CarReservationController(ICarReservationRepository reservationRepository,
                      ILogger<CarReservationController> logger,
                                       IMapper mapper)
        {
            _reservationRepository = reservationRepository;
            _logger = logger;
            _mapper = mapper;
        }


        /// <summary>
        /// Gets all cars.
        /// </summary>
        /// <returns>All cars</returns>
        [HttpGet]
    //    [Authorize]
        //     [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IEnumerable<CarReservationViewModel> Get()
        {
            return _mapper.Map<IEnumerable<CarReservationViewModel>>(_reservationRepository.GetAll());
        }



        /// <summary>
        /// Gets car by id.
        /// </summary>
        /// <returns>car</returns>
        [HttpGet("byCar/{carId}")]
        //    [Authorize]
        //     [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IEnumerable<CarReservationViewModel> GetReservationById([FromBody] CarReservationIntervalViewModel reservation, int carId)
        {
            return _mapper.Map<IEnumerable<CarReservationViewModel>>(_reservationRepository.GetReservationsByCarInTimeInterval(carId, DateTime.Parse(reservation.from), DateTime.Parse(reservation.to)));
        }



        /// <summary>
        /// Post new car.
        /// </summary>
        /// <param name="reservationVm">New user.</param>
        /// <returns>Added car.</returns>
        [HttpPost()]
        [ValidateModelState, CheckArgumentsForNull]
        //      [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult Post([FromBody] CarReservationViewModel reservationVm)
        {
            return this.CreateNewReservation(reservationVm);
        }

        /// <summary>
        /// Create new car.
        /// </summary>
        /// <param name="reservationVm">New car.</param>
        /// <returns>Info about creating of car.</returns>
        private IActionResult CreateNewReservation(CarReservationViewModel reservationVm)
        {
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



        /// <summary>
        /// Gets car by id.
        /// </summary>
        /// <returns>car</returns>
        [HttpGet("{reservationId}")]
        //    [Authorize]
        //     [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult GetUser(int reservationId)
        {
            var reservation = _reservationRepository.GetItem(reservationId);

            if (reservation == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }
            else
            {
                return this.Json(_mapper.Map<CarReservationViewModel>(reservation));
            }
        }




        /// <summary>
        /// Update the car.
        /// </summary>
        /// <param name="reservationId">Car id for update.</param>
        /// <param name="reservationVm">Car view model, with new properties.</param>
        /// <returns>Updated car.</returns>
        [HttpPut("{reservationId}")]
        [ValidateModelState, CheckArgumentsForNull]
        //[Authorize(Roles = "Administrator")] - ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult Put(int reservationId, [FromBody] CarReservationViewModel reservationVm)
        {
            if (reservationVm.Id != reservationId)
            {
                var message = $"Invalid argument. Id '{reservationId}' and userVm.Id '{reservationVm.Id}' are not equal.";
                _logger.LogWarning(message);

                this.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return this.Json(new { Message = message });
            }

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





        /// <summary>
        /// Deletes the specified car.
        /// </summary>
        /// <param name="reservationId">The car identifier.</param>
        [HttpDelete("{reservationId}")]
        //[Authorize(Roles = "Administrator")] - ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult Delete(int reservationId)
        {
            return SaveData(() =>
            {
                _reservationRepository.Delete(reservationId);
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




    }
}
