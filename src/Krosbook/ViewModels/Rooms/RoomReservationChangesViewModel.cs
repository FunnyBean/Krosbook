using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.ViewModels.Rooms
{
    public class RoomReservationChangesViewModel
    {
        public DateTime dateTime { get; set; }

        public string dateAndTime { get; set; }

        public int RoomReservationId { get; set; }
    }
}
