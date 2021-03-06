﻿using Krosbook.Models.Base;
using Krosbook.Models.Reservation;
using System;
using System.Linq;

namespace Krosbook.Models.Reservation
{
    /// <summary>
    /// Interface, which describe repository for CRUD operations on the Equipment model.
    /// </summary>
    public interface ICarReservationRepository : IRepository<CarReservation>
    {
        IQueryable<CarReservation> GetReservationsByCar(int carId);
        IQueryable<CarReservation> GetReservationsCarByUser(int userId);
        IQueryable<CarReservation> GetReservationsByState(int reservationState);
        IQueryable<CarReservation> GetReservationsByCarInTimeInterval(int carId, DateTime from, DateTime to);
        IQueryable<CarReservation> GetAllInInterval(string interval);
    //    bool CheckUnreservedCar(int carId, DateTime date, int length);
    }
}
