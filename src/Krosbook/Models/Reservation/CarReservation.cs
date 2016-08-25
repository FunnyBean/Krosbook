using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Krosbook.Models.Cars;
using Krosbook.Models.Users;
using Krosbook.Models.Base;

namespace Krosbook.Models.Reservation
{
    public class CarReservation:IModel
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the car identifier.
        /// </summary>
        /// <value>
        /// The car identifier.
        /// </value>
        public int CarId { get; set; }

        /// <summary>
        /// Gets or sets the car.
        /// </summary>
        /// <value>
        /// The car.
        /// </value>
        /// <remarks>Navigation property.</remarks>
        public Car Car { get; set; }


        /// <summary>
        /// Gets or sets the user identifier.
        /// </summary>
        /// <value>
        /// The user identifier.
        /// </value>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the user.
        /// </summary>
        /// <value>
        /// The user.
        /// </value>
        /// <remarks>Navigation property.</remarks>
        public User User { get; set; }

        /// <summary>
        /// Date and Time.
        /// </summary>       
        public DateTime DateTimeStart { get; set; }

        public DateTime DateTimeEnd { get; set; }

        public string Destination { get; set; }
        
        public string TravelInsurance { get; set; }
        
        public Boolean GPSSystem { get; set; }

        public string Requirements { get; set; }

        public Boolean PrivateUse { get; set; }

        public int ReservationState { get; set; }
    }
}
