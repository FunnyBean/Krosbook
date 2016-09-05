using Krosbook.Services.Template;
using Krosbook.Models.Reservation;
using Krosbook.Models.Cars;

namespace Krosbook.Services.Email
{
    /// <summary>
    /// Data for email message for resetting password.
    /// </summary>
    public class EmailCarReservation : BaseEmailData
    {

        #region Constructors

        private ICarRepository _carRepository;
        /// <summary>
        /// Initializes data with link for password reset <paramref name="title" />.
        /// </summary>
        /// <param name="title">Link where user can reset his password.</param>
        public EmailCarReservation(CarReservation carReservation, ICarRepository carRepository) : base("ReservationCar")
        {
            _carRepository = carRepository;
            Car car = _carRepository.GetItem(carReservation.CarId);

            this.destination = carReservation.Destination;
            this.carName = car.Name + " : " + car.Plate;
            this.startDateTime = carReservation.DateTimeStart.ToString("dd.MM.yyyy HH:mm");
            this.endDateTime = carReservation.DateTimeEnd.ToString("dd.MM.yyyy HH:mm");
            this.gps = (carReservation.GPSSystem == true) ? "pridelená" : "nepridelená";
        }

        #endregion


        #region General

        /// <summary>
        /// Link where user can reset his password.
        /// </summary>
        [TemplateVariable("destination")]
        public string destination { get; }

        [TemplateVariable("carName")]
        public string carName { get; set; }

        [TemplateVariable("startDateTime")]
        public string startDateTime { get; set; }

        [TemplateVariable("endDateTime")]
        public string endDateTime { get; set; }

        [TemplateVariable("gps")]
        public string gps { get; set; }

        #endregion

    }
}
