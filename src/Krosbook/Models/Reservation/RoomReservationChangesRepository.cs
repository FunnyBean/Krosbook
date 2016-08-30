using Krosbook.Models.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.Models.Reservation
{
    public class RoomReservationChangesRepository : BaseRepository<RoomReservationChanges>, IRoomReservationChangesRepository
    {
        public RoomReservationChangesRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public IQueryable<RoomReservationChanges> GetChangesByReservation(int reservationId)
        {
            return this.Get(x=>x.RoomReservationId==reservationId);
        }
    }
}
