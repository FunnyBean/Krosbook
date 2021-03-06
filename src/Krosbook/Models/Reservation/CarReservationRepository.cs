﻿using Krosbook.Models.Base;
using Krosbook.Models.Reservation;
using System;
using System.Linq;

namespace Krosbook.Models.Reservation
{
    /// <summary>
    /// Rooms repository with EF
    /// </summary>
    /// <seealso cref="ICarReservationRepository " />
    /// <seealso cref="Krosbook.Models.Base.BaseRepository{T}" />
    public class CarReservationRepository : BaseRepository<CarReservation>, ICarReservationRepository
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CarReservationRepository"/> class.
        /// </summary>
        /// <param name="dbContext">The database context.</param>
        public CarReservationRepository(ApplicationDbContext dbContext)
            : base(dbContext)
        {
        }

        /// <summary>
        /// Gets all cars
        /// </summary>
        /// <returns>
        /// Return all cars; otherwise null.
        /// </returns>
        public override IQueryable<CarReservation> GetAll()
        {
            return _dbContext.Set<CarReservation>().OrderByDescending(r => r.DateTimeStart);
        }

        public IQueryable<CarReservation> GetAllInInterval(string interval)
        {
            if (interval == "all")
                return this.GetAll();
            else
            {
                if(interval == "week")
                {
                    return this.Get(r => r.DateTimeStart >= DateTime.Now.AddDays(-7) || r.DateTimeEnd >= DateTime.Now.AddDays(-7)).OrderByDescending(r => r.DateTimeStart);
                }
                else if(interval == "month")
                {
                    return this.Get(r => r.DateTimeStart >= DateTime.Now.AddMonths(-1) || r.DateTimeEnd >= DateTime.Now.AddMonths(-1)).OrderByDescending(r => r.DateTimeStart);
                }
                else
                {
                    return this.Get(r => r.DateTimeStart >= DateTime.Now.AddYears(-1) || r.DateTimeEnd >= DateTime.Now.AddYears(-1)).OrderByDescending(r => r.DateTimeStart);
                }
            }
        }


        /// <summary>
        /// Edits the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        public override void Edit(CarReservation item)
        {
            base.Edit(item);
        }


        public IQueryable<CarReservation> GetReservationsByCar(int carId)
        {
            return this.Get(r => r.CarId == carId);
        }

        public IQueryable<CarReservation> GetReservationsByState(int reservationState)
        {
            return this.Get(r => r.ReservationState == reservationState);
        }

        public IQueryable<CarReservation> GetReservationsCarByUser(int userId)
        {
            return this.Get(r => r.UserId == userId).OrderByDescending(r => r.DateTimeStart);
        }

        public IQueryable<CarReservation> GetReservationsByCarInTimeInterval(int carId, DateTime from, DateTime to)
        {
            return this.Get(r => r.CarId == carId && ((r.DateTimeStart >= from && r.DateTimeStart <= to) || (r.DateTimeEnd >= from && r.DateTimeEnd <= to) || (from > r.DateTimeStart && to < r.DateTimeEnd)) && r.ReservationState != 1);
        }


    }

}
