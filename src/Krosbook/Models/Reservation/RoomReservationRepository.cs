using Krosbook.Models.Base;
using Krosbook.Models.Reservation;
using System.Linq;
using System;
using System.Collections.Generic;

namespace Krosbook.Models.Reservation
{
    /// <summary>
    /// Rooms repository with EF
    /// </summary>
    /// <seealso cref="IRoomReservationRepository " />
    /// <seealso cref="Krosbook.Models.Base.BaseRepository{T}" />
    public class RoomReservationRepository : BaseRepository<RoomReservation>, IRoomReservationRepository
    {
        private IRoomReservationRepeaterRepository _repeaterRepository;
        /// <summary>
        /// Initializes a new instance of the <see cref="RoomReservationRepository"/> class.
        /// </summary>
        /// <param name="dbContext">The database context.</param>
        public RoomReservationRepository(ApplicationDbContext dbContext, IRoomReservationRepeaterRepository repeaterRepository)
            : base(dbContext)
        {
            this._repeaterRepository = repeaterRepository;
        }

        /// <summary>
        /// Gets all cars
        /// </summary>
        /// <returns>
        /// Return all cars; otherwise null.
        /// </returns>
        public override IQueryable<RoomReservation> GetAll()
        {
            return _dbContext.Set<RoomReservation>();
        }


        /// <summary>
        /// Edits the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        public override void Edit(RoomReservation item)
        {
            base.Edit(item);
        }

        public IQueryable<RoomReservation> GetReservationsByRoom(int roomId)
        {
            return this.Get(r => r.RoomId == roomId);
        }

        public IQueryable<RoomReservation> GetReservationsByRoomInTimeInterval(int roomId, DateTime from, DateTime to)
        {  
            var reservations = this.Get(r => r.RoomId == roomId && r.dateTime >= from && r.dateTime <= to);

            IList<RoomReservation> export = new List<RoomReservation>();

            foreach (var res in reservations) {
                export.Add(res);
               // if (_repeaterRepository.GetSingleByReservationId(res.Id) != null) {
                   //prejde tabulkou roomReservationRepeater a pouzije zanamy, ktorych EndDate >= to && from>= startDate 
                    //nastavi nejake pravidla opakovania rezervacii a prida v cykle do Listu
//                }
            }
            


            return export.AsQueryable();
        }

    }

}
