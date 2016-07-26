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
    [Route("api/reservations/rooms")]
    [EnableCors("AllowAll")]
    public class RoomReservationController: BaseController
    {
        #region Private Fields

        private IRoomReservationRepository _reservationRepository;
        private ILogger<RoomReservationController> _logger;
        private IMapper _mapper;

        #endregion

        /// <summary>
        /// Initializes a new instance of the <see cref="RoomReservationController"/> class.
        /// </summary>
        /// <param name="carsRepository">The car repository.</param>
        /// <param name="logger">Logger.</param>
        /// <param name="mapper">Mapper for mapping domain classes to model classes and reverse.</param>
        public RoomReservationController(IRoomReservationRepository reservationRepository,
                      ILogger<RoomReservationController> logger,
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
        public IEnumerable<RoomReservationViewModel> Get()
        {
            return _mapper.Map<IEnumerable<RoomReservationViewModel>>(_reservationRepository.GetAll());
        }



        /// <summary>
        /// Post new car.
        /// </summary>
        /// <param name="reservationVm">New user.</param>
        /// <returns>Added car.</returns>
        [HttpPost()]
        [ValidateModelState, CheckArgumentsForNull]
        //      [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult Post([FromBody] RoomReservationViewModel reservationVm)
        {
            return this.CreateNewReservation(reservationVm);
        }

        /// <summary>
        /// Create new car.
        /// </summary>
        /// <param name="reservationVm">New car.</param>
        /// <returns>Info about creating of car.</returns>
        private IActionResult CreateNewReservation(RoomReservationViewModel reservationVm)
        {
           RoomReservation reservation = _mapper.Map<RoomReservation>(reservationVm);    

                return SaveData(() =>
                {
                    _reservationRepository.Add(reservation);
                },
                () =>
                {
                    this.Response.StatusCode = (int)HttpStatusCode.Created;

                    return this.Json(new JsonResult(this.Json(_mapper.Map<RoomReservationViewModel>(reservation)))
                    {
                        StatusCode = this.Response.StatusCode
                    });
                });

        }



        /// <summary>
        /// Gets car by id.
        /// </summary>
        /// <returns>car</returns>
        [HttpPost("byRoom/{roomId}")]
        //    [Authorize]
        //     [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IEnumerable<RoomReservationViewModel> GetUser([FromBody] RoomReservationIntervalViewModel reservation, int roomId)
        {
            return _mapper.Map<IEnumerable<RoomReservationViewModel>>(_reservationRepository.GetReservationsByRoomInTimeInterval(roomId, DateTime.Parse(reservation.from), DateTime.Parse(reservation.to)));
        }



        /// <summary>
        /// Gets car by id.
        /// </summary>
        /// <returns>car</returns>
        [HttpGet("{reservationId}")]
        //    [Authorize]
        //     [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult GetReservation(int reservationId)
        {
            var reservation = _reservationRepository.GetItem(reservationId);

            if (reservation == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }
            else
            {
                return this.Json(_mapper.Map<RoomReservationViewModel>(reservation));
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
        public IActionResult Put(int reservationId, [FromBody] RoomReservationViewModel reservationVm)
        {
            if (reservationVm.Id != reservationId)
            {
                var message = $"Invalid argument. Id '{reservationId}' and userVm.Id '{reservationVm.Id}' are not equal.";
                _logger.LogWarning(message);

                this.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return this.Json(new { Message = message });
            }

            Models.Reservation.RoomReservation oldReservation = _reservationRepository.GetItem(reservationId);
            if (oldReservation == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }

 
                IActionResult result;
            Models.Reservation.RoomReservation editedReservation = _mapper.Map(reservationVm, oldReservation);

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
