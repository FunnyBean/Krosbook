using Krosbook.Models.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.Models.Reservation
{
    public class RoomReservationRepeaterRepository : BaseRepository<RoomReservationRepeater>, IRoomReservationRepeaterRepository
    {
        public RoomReservationRepeaterRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}
