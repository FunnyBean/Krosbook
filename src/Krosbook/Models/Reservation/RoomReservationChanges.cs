using Krosbook.Models.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.Models.Reservation
{
    public class RoomReservationChanges : IModel
    {
        public int Id { get; set;}

        public DateTime dateTime { get; set; }

        public int RoomReservationId { get; set; }

        public virtual RoomReservation RoomReservation { get; set; }
    }
}
