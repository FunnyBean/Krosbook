﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Krosbook.Models.Cars;
using Krosbook.Models.Users;

namespace Krosbook.Models.Reservation
{
    public class CarUser
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
        public RoomReservation Car { get; set; }


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
        public DateTime dateTime { get; set; }
    }
}
