using Krosbook.Models.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.Models.Reservation
{
    public class RoomReservationRepeater : IModel
    {
        public int Id {get; set;}

        public int ReservationId { get; set; }

        public virtual RoomReservation RoomReservation { get; set; }

        //mesacne, rocne, denne,...
        public string Repetation { get; set; }

        //medzi dvomi opakovaniami
        public int Interval { get; set; }
    
        public DateTime EndDate { get; set; }



    }
}
