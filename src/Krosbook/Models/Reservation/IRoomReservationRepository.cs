using Krosbook.Models.Base;
using Krosbook.Models.Reservation;

namespace Krosbook.Models.Reservation
{
    /// <summary>
    /// Interface, which describe repository for CRUD operations on the Equipment model.
    /// </summary>
    public interface IRoomReservationRepository : IRepository<RoomReservation>
    {
    }
}
