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

namespace Krosbook.Controllers.Api.v1
{
    [Route("api/cars")]
    [EnableCors("AllowAll")]
    public class CarsController: BaseController
    {
        #region Private Fields

        private ICarRepository _carRepository;
        private ILogger<CarsController> _logger;
        private IMapper _mapper;

        #endregion

        /// <summary>
        /// Initializes a new instance of the <see cref="CarsController"/> class.
        /// </summary>
        /// <param name="carsRepository">The car repository.</param>
        /// <param name="logger">Logger.</param>
        /// <param name="mapper">Mapper for mapping domain classes to model classes and reverse.</param>
        public CarsController(ICarRepository carRepository,
                      ILogger<CarsController> logger,
                                       IMapper mapper)
        {
            _carRepository = carRepository;
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
        public IEnumerable<CarViewModel> Get()
        {
            return _mapper.Map<IEnumerable<CarViewModel>>(_carRepository.GetAll());
        }



        /// <summary>
        /// Post new car.
        /// </summary>
        /// <param name="carVm">New user.</param>
        /// <returns>Added car.</returns>
        [HttpPost()]
        [ValidateModelState, CheckArgumentsForNull]
        //      [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult Post([FromBody] CarViewModel carVm)
        {
            return this.CreateNewCar(carVm);
        }

        /// <summary>
        /// Create new car.
        /// </summary>
        /// <param name="carVm">New car.</param>
        /// <returns>Info about creating of car.</returns>
        private IActionResult CreateNewCar(CarViewModel carVm)
        {
            if (_carRepository.GetItem(u => u.Plate == carVm.Plate) == null)
            {
                Car car = _mapper.Map<Car>(carVm);        


                return SaveData(() =>
                {
                    _carRepository.Add(car);
                },
                () =>
                {
                    this.Response.StatusCode = (int)HttpStatusCode.Created;

                    return this.Json(new JsonResult(this.Json(_mapper.Map<CarViewModel>(car)))
                    {
                        StatusCode = this.Response.StatusCode
                    });
                });
            }
            else
            {
                this.Response.StatusCode = (int)HttpStatusCode.BadRequest;

                return this.Json(new JsonResult($"Car with plate '{carVm.Plate}' already exist.")
                {
                    StatusCode = this.Response.StatusCode
                });
            }
        }



        /// <summary>
        /// Gets car by id.
        /// </summary>
        /// <returns>car</returns>
        [HttpGet("{carId}")]
        //    [Authorize]
        //     [Authorize(Roles = "Admin")] //- ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult GetUser(int carId)
        {
            var car = _carRepository.GetItem(carId);

            if (car == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }
            else
            {
                return this.Json(_mapper.Map<CarViewModel>(car));
            }
        }




        /// <summary>
        /// Update the car.
        /// </summary>
        /// <param name="carId">Car id for update.</param>
        /// <param name="carVm">Car view model, with new properties.</param>
        /// <returns>Updated car.</returns>
        [HttpPut("{carId}")]
        [ValidateModelState, CheckArgumentsForNull]
        //[Authorize(Roles = "Administrator")] - ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult Put(int carId, [FromBody] CarViewModel carVm)
        {
            if (carVm.Id != carId)
            {
                var message = $"Invalid argument. Id '{carId}' and userVm.Id '{carVm.Id}' are not equal.";
                _logger.LogWarning(message);

                this.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return this.Json(new { Message = message });
            }

            Car oldCar = _carRepository.GetItem(carId);
            if (oldCar == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }

            if (ExistAnotherUserWithPlate(carVm.Plate, carId))
            {
                this.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return this.Json(new { Message = $"Car with plate '{carVm.Plate}' already exist." });
            }
            else
            {
                IActionResult result;
                Car editedCar = _mapper.Map(carVm, oldCar);

                result = SaveData(() =>
                {
                    _carRepository.Edit(editedCar);
                });

                return result;
            }
        }





        /// <summary>
        /// Deletes the specified car.
        /// </summary>
        /// <param name="carId">The car identifier.</param>
        [HttpDelete("{carId}")]
        //[Authorize(Roles = "Administrator")] - ToDo: Zakomentovane pokiaľ sa nespraví autorizácia
        public IActionResult Delete(int carId)
        {
            return SaveData(() =>
            {
                _carRepository.Delete(carId);
            });
        }


        
        private bool ExistAnotherUserWithPlate(string plate, int carId)
        {
            Car car = _carRepository.GetItem(u => u.Plate == plate);

            return car != null && car.Id != carId;
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
                _carRepository.Save();

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
