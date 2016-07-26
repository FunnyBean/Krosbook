using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.ViewModels.Reservation
{
    public class RoomUserViewModel
    {
        /// <summary>
        /// Gets or sets the equipment identifier.
        /// </summary>
        /// <value>
        /// The equipment identifier.
        /// </value>
        public int UserId { get; set; }


        /// <summary>
        /// DateTime.
        /// </summary>
        public DateTime dateTime { get; set; }

        ///length of reservation
        public int length { get; set; }

        public override string ToString()
        {
            return $"{this.UserId} - {this.dateTime}";
        }
    }
}
