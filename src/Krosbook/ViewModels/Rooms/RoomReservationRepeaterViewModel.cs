using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.ViewModels.Rooms
{
    public class RoomReservationRepeaterViewModel
    {
        public int Id { get; set; }

        public int ReservationId { get; set; }  

        //mesacne, rocne, denne,...
        public string Repetation { get; set; }

        //medzi dvomi opakovaniami
        public int Interval { get; set; }

        public DateTime EndDate { get; set; }

        public int? Appearance { get; set; }

        public string endingDate { get; set; }
    }
}
