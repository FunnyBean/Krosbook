using Krosbook.Services.Template;
using Krosbook.Models.Reservation;
using Krosbook.Models.Cars;

namespace Krosbook.Services.Email
{
    /// <summary>
    /// Data for email message for resetting password.
    /// </summary>
    public class EmailCarReservationNew : BaseEmailData
    {

        #region Constructors

        private ICarRepository _carRepository;
        /// <summary>
        /// Initializes data with link for password reset <paramref name="title" />.
        /// </summary>
        /// <param name="title">Link where user can reset his password.</param>
        public EmailCarReservationNew(CarReservation carReservation) : base("ReservationCarNew")
        {
            this.link = "http://funnybean.cloudapp.net/home/reservations/cars/editreservation/" + carReservation.Id;
        }

        #endregion


        #region General

        /// <summary>
        /// Link where user can reset his password.
        /// </summary>
        [TemplateVariable("link")]
        public string link { get; }

        #endregion

    }
}
