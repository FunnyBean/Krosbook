using Krosbook.Models.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.Models.Reservation
{
    public interface IRoomReservationRepeaterRepository: IRepository<RoomReservationRepeater>
    {
        RoomReservationRepeater GetSingleByReservationId(int ReservationId);
    }
}
