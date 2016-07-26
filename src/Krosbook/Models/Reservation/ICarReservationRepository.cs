﻿using Krosbook.Models.Base;
using Krosbook.Models.Reservation;
using System.Linq;

namespace Krosbook.Models.Reservation
{
    /// <summary>
    /// Interface, which describe repository for CRUD operations on the Equipment model.
    /// </summary>
    public interface ICarReservationRepository : IRepository<CarReservation>
    {
        IQueryable<CarReservation> GetReservationsByCar(int carId);
    }
}
