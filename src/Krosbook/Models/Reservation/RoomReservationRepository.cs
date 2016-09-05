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
        private IRoomReservationChangesRepository _changesRepository;
        /// <summary>
        /// Initializes a new instance of the <see cref="RoomReservationRepository"/> class.
        /// </summary>
        /// <param name="dbContext">The database context.</param>
        public RoomReservationRepository(ApplicationDbContext dbContext, IRoomReservationRepeaterRepository repeaterRepository,
            IRoomReservationChangesRepository changesRepository)
            : base(dbContext)
        {
            this._repeaterRepository = repeaterRepository;
            this._changesRepository = changesRepository;
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



            foreach (var res in reservations)
            {
                var changes = _changesRepository.GetChangesByReservation(res.Id);
                export.Add(res);
                //pre denne opakovania v danom tyzdni
                var repeater = _repeaterRepository.GetSingleByReservationId(res.Id);
                if (repeater != null && repeater.Repetation == "days")
                {
                    DateTime tempDate = res.dateTime;
                    while (tempDate < repeater.EndDate && tempDate <= to)
                    {
                        if (tempDate.DayOfWeek == DayOfWeek.Monday || tempDate.DayOfWeek == DayOfWeek.Tuesday
                           || tempDate.DayOfWeek == DayOfWeek.Wednesday || tempDate.DayOfWeek == DayOfWeek.Thursday)
                        {
                            RoomReservation res2 = new RoomReservation();
                            res2.G2MeetingID = res.G2MeetingID;
                            res2.Id = res.Id;
                            res2.length = res.length;
                            res2.Room = res.Room;
                            res2.RoomId = res.RoomId;
                            res2.RoomReservationRepeater = res.RoomReservationRepeater;
                            res2.RoomReservationRepeaterId = res.RoomReservationRepeaterId;
                            res2.User = res.User;
                            res2.UserId = res.UserId;
                            res2.name = res.name;

                            tempDate = tempDate.AddDays(1 * repeater.Interval);
                            res2.dateTime = tempDate;
                            bool canCreateReservation = true;

                            foreach (var c in changes)
                            {
                                if (c.dateTime == res2.dateTime)
                                {
                                    canCreateReservation = false;
                                    break;
                                }
                                else
                                {
                                    canCreateReservation = true;
                                }
                            }
                            if (canCreateReservation)
                            {
                                export.Add(res2);
                            }

                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }

            //vsetky rezervacie s opakovaniami, ktorych opakovania este neskoncili
            IList<RoomReservation> otherReservations = new List<RoomReservation>();
            var reservationIds = _repeaterRepository.Get(x => x.EndDate >= from && x.RoomReservation.RoomId == roomId);

            foreach (var i in reservationIds)
            {
                var reser = this.GetItem(i.ReservationId);
                if (reser != null && reser.dateTime <= from)
                {
                    otherReservations.Add(reser);
                }
            }

            foreach (var res in otherReservations)
            {
                var repeater = _repeaterRepository.GetItem((int)res.RoomReservationRepeaterId);
                var changes = _changesRepository.GetChangesByReservation(res.Id);

                DateTime tempDate = res.dateTime;
                if (repeater != null && repeater.Repetation == "days")
                {
                    while (tempDate <= to)
                    {
                        if (tempDate.DayOfWeek == DayOfWeek.Monday || tempDate.DayOfWeek == DayOfWeek.Tuesday
                            || tempDate.DayOfWeek == DayOfWeek.Wednesday || tempDate.DayOfWeek == DayOfWeek.Thursday || tempDate.DayOfWeek == DayOfWeek.Friday)
                        {

                            if (tempDate.Date >= from.Date && tempDate.Date <= repeater.EndDate.Date)
                            {
                                RoomReservation res2 = new RoomReservation();
                                res2.G2MeetingID = res.G2MeetingID;
                                res2.Id = res.Id;
                                res2.length = res.length;
                                res2.Room = res.Room;
                                res2.RoomId = res.RoomId;
                                res2.RoomReservationRepeater = res.RoomReservationRepeater;
                                res2.RoomReservationRepeaterId = res.RoomReservationRepeaterId;
                                res2.User = res.User;
                                res2.UserId = res.UserId;
                                res2.name = res.name;
                                res2.dateTime = tempDate;

                                bool canCreateReservation = true;

                                foreach (var c in changes)
                                {
                                    if (c.dateTime == res2.dateTime)
                                    {
                                        canCreateReservation = false;
                                        break;
                                    }
                                    else
                                    {
                                        canCreateReservation = true;
                                    }
                                }
                                if (canCreateReservation)
                                {
                                    export.Add(res2);
                                }
                            }
                            else
                            {
                                if (tempDate >= to)
                                {
                                    break;
                                }
                            }
                            if (tempDate.DayOfWeek == DayOfWeek.Friday)
                            {
                                tempDate = tempDate.AddDays(3);

                            }
                            else
                            {
                                tempDate = tempDate.AddDays(1 * repeater.Interval);
                            }
                        }

                    }
                }

                tempDate = res.dateTime;
                if (repeater != null && repeater.Repetation == "weeks")
                {
                    while (tempDate <= to)
                    {
                        tempDate = tempDate.AddDays(7 * repeater.Interval);
                        if (from <= tempDate && tempDate <= to)
                        {
                            RoomReservation res2 = new RoomReservation();
                            res2.G2MeetingID = res.G2MeetingID;
                            res2.Id = res.Id;
                            res2.length = res.length;
                            res2.Room = res.Room;
                            res2.RoomId = res.RoomId;
                            res2.RoomReservationRepeater = res.RoomReservationRepeater;
                            res2.RoomReservationRepeaterId = res.RoomReservationRepeaterId;
                            res2.User = res.User;
                            res2.UserId = res.UserId;
                            res2.name = res.name;
                            res2.dateTime = tempDate;
                            bool canCreateReservation = true;

                            foreach (var c in changes)
                            {
                                if (c.dateTime == res2.dateTime)
                                {
                                    canCreateReservation = false;
                                    break;
                                }
                                else
                                {
                                    canCreateReservation = true;
                                }
                            }
                            if (canCreateReservation)
                            {
                                export.Add(res2);
                            }
                        }
                    }
                }
                tempDate = res.dateTime;
                if (repeater != null && repeater.Repetation == "months")
                {
                    while (tempDate <= to)
                    {
                        tempDate = tempDate.AddMonths(1 * repeater.Interval);
                        if (from <= tempDate && tempDate <= to)
                        {
                            RoomReservation res2 = new RoomReservation();
                            res2.G2MeetingID = res.G2MeetingID;
                            res2.Id = res.Id;
                            res2.length = res.length;
                            res2.Room = res.Room;
                            res2.RoomId = res.RoomId;
                            res2.RoomReservationRepeater = res.RoomReservationRepeater;
                            res2.RoomReservationRepeaterId = res.RoomReservationRepeaterId;
                            res2.User = res.User;
                            res2.UserId = res.UserId;
                            res2.name = res.name;
                            res2.dateTime = tempDate;
                            bool canCreateReservation = true;

                            foreach (var c in changes)
                            {
                                if (c.dateTime == res2.dateTime)
                                {
                                    canCreateReservation = false;
                                    break;
                                }
                                else
                                {
                                    canCreateReservation = true;
                                }
                            }
                            if (canCreateReservation)
                            {
                                export.Add(res2);
                            }
                        }
                    }
                }
                tempDate = res.dateTime;
                if (repeater != null && repeater.Repetation == "years")
                {
                    while (tempDate <= to)
                    {
                        tempDate = tempDate.AddYears(1 * repeater.Interval);
                        if (from <= tempDate && tempDate <= to)
                        {
                            RoomReservation res2 = new RoomReservation();
                            res2.G2MeetingID = res.G2MeetingID;
                            res2.Id = res.Id;
                            res2.length = res.length;
                            res2.Room = res.Room;
                            res2.RoomId = res.RoomId;
                            res2.RoomReservationRepeater = res.RoomReservationRepeater;
                            res2.RoomReservationRepeaterId = res.RoomReservationRepeaterId;
                            res2.User = res.User;
                            res2.UserId = res.UserId;
                            res2.name = res.name;
                            res2.dateTime = tempDate;
                            bool canCreateReservation = true;

                            foreach (var c in changes)
                            {
                                if (c.dateTime == res2.dateTime)
                                {
                                    canCreateReservation = false;
                                    break;
                                }
                                else
                                {
                                    canCreateReservation = true;
                                }
                            }
                            if (canCreateReservation)
                            {
                                export.Add(res2);
                            }
                        }
                    }
                }

                //nastavia sa jednotlive rezervacie a pridaju sa do exportu
            }


            return export.AsQueryable();
        }


        //overim ci mozno vytvorit opakovanie na dany datum
        public bool CanMakeReservation(int roomId, DateTime from, int length)
        {
            List<RoomReservation> reservations = GetReservationsByRoomInTimeInterval(roomId, from.Date, from.AddHours(23)).ToList();
            var ret = true;

            foreach (var res in reservations)
            {

                if ((from >= res.dateTime && from < res.dateTime.AddMinutes(res.length)) || (res.dateTime >= from && res.dateTime < from.AddMinutes(length)))
                {
                    ret = false;
                    break;
                    
                }
                else
                {
                    ret = true;
                }

            }

            return ret;
        }

    }

}
