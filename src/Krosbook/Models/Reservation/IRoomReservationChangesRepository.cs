using Krosbook.Models.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.Models.Reservation
{
    public interface IRoomReservationChangesRepository : IRepository<RoomReservationChanges>
    {
        IQueryable<RoomReservationChanges> GetChangesByReservation(int reservationId);
    }
}
