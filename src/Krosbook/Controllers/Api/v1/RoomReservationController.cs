﻿using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System;
using Krosbook.Filters;
using Microsoft.Extensions.Logging;
using Krosbook.Models.Users;
using Krosbook.ViewModels.Users;
using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Krosbook.Models.Cars;
using Krosbook.ViewModels.Cars;
using Krosbook.Models.Reservation;
using Krosbook.ViewModels.Rooms;
using Krosbook.ViewModels.Reservation;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Krosbook.Services.Email;
using Krosbook.Services.G2Meeting;

namespace Krosbook.Controllers.Api.v1
{
    [Route("api/reservations/rooms")]
    [EnableCors("AllowAll")]
    [Authorize]
    public class RoomReservationController : BaseController
    {
        #region Private Fields

        private IRoomReservationRepository _reservationRepository;
        private IRoomReservationRepeaterRepository _reservationRepeaterRepository;
        private IRoomReservationChangesRepository _reservationChangesRepository;
        private ILogger<RoomReservationController> _logger;
        private IMapper _mapper;
        private IEmailService _emailService;
        private IG2MService _G2MService;


        #endregion

        #region Constructor
        public RoomReservationController(IRoomReservationRepository reservationRepository,
                      ILogger<RoomReservationController> logger,
                                       IMapper mapper, IEmailService emailService, IG2MService G2MService, IRoomReservationRepeaterRepository reservationRepeaterRepository,
                                       IRoomReservationChangesRepository reservationChangesRepository
                                       )
        {
            _reservationRepository = reservationRepository;
            _logger = logger;
            _mapper = mapper;
            _emailService = emailService;
            _G2MService = G2MService;
            _reservationRepeaterRepository = reservationRepeaterRepository;
            _reservationChangesRepository = reservationChangesRepository;
        }

        #endregion

        #region API

        [HttpGet]
        public IEnumerable<RoomReservationViewModel> GetAllRoomReservations()
        {
            return _mapper.Map<IEnumerable<RoomReservationViewModel>>(_reservationRepository.GetAll());
        }


        [HttpPost()]
        [ValidateModelState, CheckArgumentsForNull]
        public IActionResult CreateNewRoomReservation([FromBody] RoomReservationViewModel reservationVm)
        {
            reservationVm.dateTime = DateTime.ParseExact(reservationVm.date, "dd.MM.yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture);
            this.CreateNewReservation(reservationVm);


            List<Models.Reservation.RoomReservation> reservation = _reservationRepository.Get(r => r.name == reservationVm.name && r.RoomId == reservationVm.RoomId && r.length == reservationVm.length && r.UserId == reservationVm.UserId && r.dateTime == reservationVm.dateTime).ToList();
            if (reservation[0] == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return this.Json(null);
            }
            else
            {
                this.Response.StatusCode = (int)HttpStatusCode.Created;
                return this.Json(_mapper.Map<RoomReservationViewModel>(reservation[0]));
            }
        }




        [HttpPost("byRoom/{roomId}")]
        public IEnumerable<RoomReservationViewModel> GetReservationByRoom([FromBody] RoomReservationIntervalViewModel reservation, int roomId)
        {
            return _mapper.Map<IEnumerable<RoomReservationViewModel>>(_reservationRepository.GetReservationsByRoomInTimeInterval(roomId, DateTime.ParseExact(reservation.from, "dd.MM.yyyy", System.Globalization.CultureInfo.InvariantCulture), DateTime.ParseExact(reservation.to, "dd.MM.yyyy", System.Globalization.CultureInfo.InvariantCulture)));
        }



        [HttpGet("{reservationId}")]
        public IActionResult GetReservationById(int reservationId)
        {
            var reservation = _reservationRepository.GetItem(reservationId);
            if (reservation == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }
            else
            {
                return this.Json(_mapper.Map<RoomReservationViewModel>(reservation));
            }
        }



        [HttpPut("{reservationId}")]
        [ValidateModelState, CheckArgumentsForNull]
        public IActionResult UpdateReservation(int reservationId, [FromBody] RoomReservationViewModel reservationVm)
        {
            if (!User.IsInRole("Admin"))
            {
                if (reservationVm.UserId != GetUserId())
                {
                    var message = $"User with id " + GetUserId() + " can't update reservation, that was created by user with id " + reservationVm.UserId;
                    _logger.LogWarning(message);
                    this.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return this.Json(new { Message = message });
                }
            }

            if (reservationVm.Id != reservationId)
            {
                var message = $"Invalid argument. Id '{reservationId}' and userVm.Id '{reservationVm.Id}' are not equal.";
                _logger.LogWarning(message);
                this.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return this.Json(new { Message = message });
            }

            Models.Reservation.RoomReservation oldReservation = _reservationRepository.GetItem(reservationId);
            if (oldReservation == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }

            IActionResult result;
            Models.Reservation.RoomReservation editedReservation = _mapper.Map(reservationVm, oldReservation);
            result = SaveData(() =>
            {

                if (reservationVm.goToMeeting)
                {
                    if (_G2MService.canCreateMeeting(reservationVm))
                    {

                        var meeting = new Citrix.GoToMeeting.Api.Model.MeetingCreated();
                        string joinUrl = "";
                        if (_reservationRepository.GetItem(editedReservation.Id).G2MeetingID == 0)
                        {
                            meeting = _G2MService.createNewMeeting(reservationVm);
                            joinUrl = meeting.joinURL;
                        }
                        else
                        {
                            var m = _G2MService.updateMeeting(reservationVm, _reservationRepository.GetItem(editedReservation.Id).G2MeetingID);
                            meeting = m;
                            joinUrl = m.joinURL;
                        }



                        editedReservation.G2MeetingID = int.Parse(meeting.meetingid.ToString());

                        if (reservationVm.emailInvitation)
                        {
                            _emailService.CreateEmailCalendarEvent(reservationVm, joinUrl);
                        }
                        else
                        {
                            _emailService.SendG2M(reservationVm, joinUrl);
                        }
                    }
                    else
                    {
                        this.Response.StatusCode = (int)HttpStatusCode.Conflict;
                    }
                }
                else
                {
                    if (reservationVm.emailInvitation)
                    {
                        _emailService.CreateEmailCalendarEvent(reservationVm);
                    }
                }

                _reservationRepository.Edit(editedReservation);
            });
            return result;
        }


        [HttpDelete("{reservationId}")]
        public IActionResult DeleteReservation(int reservationId)
        {
            if (!User.IsInRole("Admin"))
            {
                if (_reservationRepository.GetItem(reservationId).UserId != GetUserId())
                {
                    var message = $"User with id " + GetUserId() + " can't delete reservation, that was created by user with id " + _reservationRepository.GetItem(reservationId).UserId;
                    _logger.LogWarning(message);
                    this.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return this.Json(new { Message = message });
                }
            }
            return SaveData(() =>
            {
                var g2mId = _reservationRepository.GetItem(reservationId).G2MeetingID;
                _reservationRepository.Delete(reservationId);
                if (g2mId != 0)
                {
                    _G2MService.deleteMeeting(g2mId);
                }

            });
        }


        [HttpGet("repetition/{repetitionId}")]
        public IActionResult GetReservationRepetitionById(int repetitionId)
        {
            var repetition = _reservationRepeaterRepository.GetItem(repetitionId);
            if (repetition == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }
            else
            {
                return this.Json(_mapper.Map<RoomReservationRepeaterViewModel>(repetition));
            }
        }


        [HttpDelete("repetition/{repetitionId}")]
        public IActionResult DeleteReservationRepetition(int repetitionId)
        {
            if (!User.IsInRole("Admin"))
            {
                if (_reservationRepository.GetItem(_reservationRepeaterRepository.GetItem(repetitionId).ReservationId).UserId != GetUserId())
                {
                    var message = $"User with id " + GetUserId() + " can't delete reservation repetition, that was created by user with id " + _reservationRepository.GetItem(repetitionId).UserId;
                    _logger.LogWarning(message);
                    this.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return this.Json(new { Message = message });
                }
            }
            return SaveData(() =>
            {
                _reservationRepeaterRepository.Delete(repetitionId);
            });
        }

        [HttpPut("repetition/{repetitionId}")]
        [ValidateModelState, CheckArgumentsForNull]
        public IActionResult UpdateReservationRepetition(int repetitionId, [FromBody] RoomReservationRepeaterViewModel repeaterVm)
        {
            if (!User.IsInRole("Admin"))
            {
                if (_reservationRepository.GetItem(_reservationRepeaterRepository.GetItem(repetitionId).ReservationId).UserId != GetUserId())
                {
                    var message = $"User with id " + GetUserId() + " can't update reservation repetition, that was created by user with id " + _reservationRepository.GetItem(repetitionId).UserId;
                    _logger.LogWarning(message);
                    this.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return this.Json(new { Message = message });
                }
            }
            if (repeaterVm.Id != repetitionId)
            {
                var message = $"Invalid argument. Id '{repetitionId}' and userVm.Id '{repeaterVm.Id}' are not equal.";
                _logger.LogWarning(message);
                this.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return this.Json(new { Message = message });
            }

            RoomReservationRepeater oldRepeater = _reservationRepeaterRepository.GetItem(repetitionId);
            if (oldRepeater == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }

            if (repeaterVm.Appearance == null)
            {
                repeaterVm.EndDate = DateTime.ParseExact(repeaterVm.endingDate, "dd.MM.yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
            }
            else
            {
                var startDate = _reservationRepository.GetItem(repeaterVm.ReservationId).dateTime;
                if (repeaterVm.Repetation == "days")
                {
                    repeaterVm.EndDate = startDate;
                    for (int i = 0; i < (repeaterVm.Appearance - 1) * repeaterVm.Interval; i++)
                    {

                        if (repeaterVm.EndDate.DayOfWeek == DayOfWeek.Monday || repeaterVm.EndDate.DayOfWeek == DayOfWeek.Tuesday
                            || repeaterVm.EndDate.DayOfWeek == DayOfWeek.Wednesday || repeaterVm.EndDate.DayOfWeek == DayOfWeek.Thursday)
                        {
                            repeaterVm.EndDate = repeaterVm.EndDate.AddDays(1);
                        }
                        if (repeaterVm.EndDate.DayOfWeek == DayOfWeek.Friday)
                        {
                            repeaterVm.EndDate = repeaterVm.EndDate.AddDays(3);
                            i++;
                        }
                    }
                }
                if (repeaterVm.Repetation == "weeks")
                {
                    repeaterVm.EndDate = startDate.AddDays((((int)repeaterVm.Appearance * 7) - 1) * repeaterVm.Interval);
                }
                if (repeaterVm.Repetation == "months")
                {
                    repeaterVm.EndDate = startDate.AddMonths(((int)repeaterVm.Appearance - 1) * repeaterVm.Interval);
                }
                if (repeaterVm.Repetation == "years")
                {
                    repeaterVm.EndDate = startDate.AddYears(((int)repeaterVm.Appearance - 1) * repeaterVm.Interval);
                }
            }

            RoomReservationRepeater editedRepeater = _mapper.Map(repeaterVm, oldRepeater);
            return SaveData(() =>
            {
                _reservationRepeaterRepository.Edit(editedRepeater);
            });
        }


        [HttpPost("repetition")]
        [ValidateModelState, CheckArgumentsForNull]
        public IActionResult CreateNewRoomRepetitionReservation([FromBody] RoomReservationRepeaterViewModel repeaterVm)
        {
            if (repeaterVm.Appearance == null)
            {
                repeaterVm.EndDate = DateTime.ParseExact(repeaterVm.endingDate, "dd.MM.yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
            }
            else
            {
                var startDate = _reservationRepository.GetItem(repeaterVm.ReservationId).dateTime;
                if (repeaterVm.Repetation == "days")
                {
                    repeaterVm.EndDate = startDate;
                    for (int i = 0; i < (repeaterVm.Appearance - 1) * repeaterVm.Interval; i++)
                    {

                        if (repeaterVm.EndDate.DayOfWeek == DayOfWeek.Monday || repeaterVm.EndDate.DayOfWeek == DayOfWeek.Tuesday
                            || repeaterVm.EndDate.DayOfWeek == DayOfWeek.Wednesday || repeaterVm.EndDate.DayOfWeek == DayOfWeek.Thursday)
                        {
                            repeaterVm.EndDate = repeaterVm.EndDate.AddDays(1);
                        }
                        if (repeaterVm.EndDate.DayOfWeek == DayOfWeek.Friday && i < (repeaterVm.Appearance - 1) * repeaterVm.Interval - 1)
                        {
                            repeaterVm.EndDate = repeaterVm.EndDate.AddDays(3);
                            i++;
                        }
                    }
                }
                if (repeaterVm.Repetation == "weeks")
                {
                    repeaterVm.EndDate = startDate.AddDays((((int)repeaterVm.Appearance * 7) - 1) * repeaterVm.Interval);
                }
                if (repeaterVm.Repetation == "months")
                {
                    repeaterVm.EndDate = startDate.AddMonths(((int)repeaterVm.Appearance - 1) * repeaterVm.Interval);
                }
                if (repeaterVm.Repetation == "years")
                {
                    repeaterVm.EndDate = startDate.AddYears(((int)repeaterVm.Appearance - 1) * repeaterVm.Interval);
                }
            }


            if (_reservationRepeaterRepository.Get(x => x.ReservationId == repeaterVm.ReservationId).Count() == 0)
            {
                var repeater = _mapper.Map<RoomReservationRepeater>(repeaterVm);
                return SaveData(() =>
                {
                    _reservationRepeaterRepository.Add(repeater);
                },
                () =>
                {
                    var reservation = _reservationRepository.GetItem(repeater.ReservationId);
                    var rep = _reservationRepeaterRepository.GetSingleByReservationId(repeater.ReservationId);
                    reservation.RoomReservationRepeaterId = rep.Id;
                    _reservationRepository.Edit(reservation);
                    _reservationRepository.Save();

                    this.Response.StatusCode = (int)HttpStatusCode.Created;
                    return this.Json(_mapper.Map<RoomReservationRepeaterViewModel>(repeater));
                });
            }
            else
            {
                this.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return this.Json(new { Message = $"Repetition with reservation id '{repeaterVm.ReservationId}' already exist." });
            }

        }


        [HttpGet("changes/{changesId}")]
        public IActionResult GetReservationChangesById(int changesId)
        {
            var changes = _reservationChangesRepository.GetItem(changesId);
            if (changes == null)
            {
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(null);
            }
            else
            {
                return this.Json(_mapper.Map<RoomReservationChangesViewModel>(changes));
            }
        }

        [HttpDelete("changes/{changesId}")]
        public IActionResult DeleteReservationChanges(int changesId)
        {
            if (!User.IsInRole("Admin"))
            {
                if (_reservationRepository.GetItem(_reservationChangesRepository.GetItem(changesId).RoomReservationId).UserId != GetUserId())
                {
                    var message = $"User with id " + GetUserId() + " can't delete reservation change, that was created by user with id " + _reservationRepository.GetItem(_reservationChangesRepository.GetItem(changesId).RoomReservationId).UserId;
                    _logger.LogWarning(message);
                    this.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return this.Json(new { Message = message });
                }
            }
            return SaveData(() =>
            {
                _reservationChangesRepository.Delete(changesId);
            });
        }

        //este treba dorobit to, ze ked sa edituje iba jeden termin rezervacie, ktora ma opakovanie, tak ze sa ten termin ulozi do tabulky roomReservationChanges
        //a vytvori sa nova rezervacia pod novym ID

        [HttpPost("changes")]
        [ValidateModelState, CheckArgumentsForNull]
        public IActionResult CreateNewRoomChangesReservation([FromBody] RoomReservationChangesViewModel changesVm)
        {
            changesVm.dateTime = DateTime.ParseExact(changesVm.dateAndTime, "dd.MM.yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
            if (!User.IsInRole("Admin"))
            {
                if (_reservationRepository.GetItem(changesVm.RoomReservationId).UserId != GetUserId())
                {
                    var message = $"User with id " + GetUserId() + " can't update reservation, that was created by user with id " + _reservationRepository.GetItem(changesVm.RoomReservationId).UserId;
                    _logger.LogWarning(message);
                    this.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return this.Json(new { Message = message });
                }
            }
            if (_reservationRepository.GetItem(changesVm.RoomReservationId) == null)
            {
                var message = $"Invalid argument. ReservationId '{changesVm.RoomReservationId}' not exists.";
                _logger.LogWarning(message);
                this.Response.StatusCode = (int)HttpStatusCode.NotFound;
                return this.Json(new { Message = message });
            }


            var changes = _mapper.Map<RoomReservationChanges>(changesVm);
            return SaveData(() =>
            {
                _reservationChangesRepository.Add(changes);
            },
                () =>
                {
                    var reservation = _reservationRepository.GetItem(changes.RoomReservationId);
                    var chan = _reservationChangesRepository.Get(x => x.dateTime == changesVm.dateTime && x.RoomReservationId == changesVm.RoomReservationId).ToList();
                    this.Response.StatusCode = (int)HttpStatusCode.Created;
                    return this.Json(_mapper.Map<RoomReservationChanges>(chan[0]));
                });
        }



        [HttpPost("checkForDuplicity")]
        [ValidateModelState, CheckArgumentsForNull]
        public IActionResult CheckForDuplicity([FromBody] RoomReservationRepeaterViewModel repeaterVm)
        {
            List<DateTime> duplicateDates = new List<DateTime>();
            #region checking
            if (repeaterVm.Appearance == null)
            {
                repeaterVm.EndDate = DateTime.ParseExact(repeaterVm.endingDate, "dd.MM.yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);

                var start = _reservationRepository.GetItem(repeaterVm.ReservationId).dateTime;
                repeaterVm.Appearance = 1;

                while (start <= repeaterVm.EndDate)
                {
                    if (repeaterVm.Repetation == "days")
                    {
                        if (start.DayOfWeek == DayOfWeek.Monday || start.DayOfWeek == DayOfWeek.Tuesday
                            || start.DayOfWeek == DayOfWeek.Wednesday || start.DayOfWeek == DayOfWeek.Thursday)
                        {
                            repeaterVm.Appearance++;
                            start = start.AddDays(1 * repeaterVm.Interval);

                        }
                        if (start.DayOfWeek == DayOfWeek.Friday)
                        {
                            repeaterVm.Appearance++;
                            start = start.AddDays(3);
                        }
                        if (start.DayOfWeek == DayOfWeek.Saturday)
                        {
                            start = start.AddDays(2);
                        }
                        if (start.DayOfWeek == DayOfWeek.Sunday)
                        {
                            start = start.AddDays(1);
                        }
                    }
                    if (repeaterVm.Repetation == "weeks")
                    {
                        repeaterVm.Appearance++;
                        start = start.AddDays(7 * repeaterVm.Interval);

                    }
                    if (repeaterVm.Repetation == "months")
                    {
                        repeaterVm.Appearance++;
                        start = start.AddMonths(1 * repeaterVm.Interval);

                    }
                    if (repeaterVm.Repetation == "years")
                    {
                        repeaterVm.Appearance++;
                        start = start.AddYears(1 * repeaterVm.Interval);

                    }
                }
            }

            var startDate = _reservationRepository.GetItem(repeaterVm.ReservationId).dateTime;
            if (repeaterVm.Repetation == "days")
            {
                repeaterVm.EndDate = startDate;
                for (int i = 0; i < (repeaterVm.Appearance - 1) * repeaterVm.Interval; i++)
                {

                    if (repeaterVm.EndDate.DayOfWeek == DayOfWeek.Monday || repeaterVm.EndDate.DayOfWeek == DayOfWeek.Tuesday
                        || repeaterVm.EndDate.DayOfWeek == DayOfWeek.Wednesday || repeaterVm.EndDate.DayOfWeek == DayOfWeek.Thursday)
                    {
                        repeaterVm.EndDate = repeaterVm.EndDate.AddDays(1 * repeaterVm.Interval);
                        if (_reservationRepository.CanMakeReservation(_reservationRepository.GetItem(repeaterVm.ReservationId).RoomId,
                            repeaterVm.EndDate, _reservationRepository.GetItem(repeaterVm.ReservationId).length, repeaterVm.ReservationId) == false)
                        {
                            DateTime dup = repeaterVm.EndDate;
                            duplicateDates.Add(dup);
                        }

                    }
                    if (repeaterVm.EndDate.DayOfWeek == DayOfWeek.Friday)
                    {
                        repeaterVm.EndDate = repeaterVm.EndDate.AddDays(3);
                        if (_reservationRepository.CanMakeReservation(_reservationRepository.GetItem(repeaterVm.ReservationId).RoomId,
                             repeaterVm.EndDate, _reservationRepository.GetItem(repeaterVm.ReservationId).length, repeaterVm.ReservationId) == false)
                        {
                            DateTime dup = repeaterVm.EndDate;
                            duplicateDates.Add(dup);
                        }

                        i++;
                    }
                    if (repeaterVm.EndDate.DayOfWeek == DayOfWeek.Saturday)
                    {
                        repeaterVm.EndDate = repeaterVm.EndDate.AddDays(2);
                    }
                    if (repeaterVm.EndDate.DayOfWeek == DayOfWeek.Sunday)
                    {
                        repeaterVm.EndDate = repeaterVm.EndDate.AddDays(1);
                    }
                }
            }
            if (repeaterVm.Repetation == "weeks")
            {
                for (int i = 1; i < (repeaterVm.Appearance - 1) * repeaterVm.Interval; i++)
                {
                    repeaterVm.EndDate = startDate.AddDays((i * 7) * repeaterVm.Interval);
                    if (_reservationRepository.CanMakeReservation(_reservationRepository.GetItem(repeaterVm.ReservationId).RoomId,
                        repeaterVm.EndDate, _reservationRepository.GetItem(repeaterVm.ReservationId).length, repeaterVm.ReservationId) == false)
                    {
                        DateTime dup = repeaterVm.EndDate;
                        duplicateDates.Add(dup);
                    }
                }
            }
            if (repeaterVm.Repetation == "months")
            {
                for (int i = 1; i < (repeaterVm.Appearance - 1) * repeaterVm.Interval; i++)
                {
                    repeaterVm.EndDate = startDate.AddMonths(i * repeaterVm.Interval);
                    if (_reservationRepository.CanMakeReservation(_reservationRepository.GetItem(repeaterVm.ReservationId).RoomId,
                        repeaterVm.EndDate, _reservationRepository.GetItem(repeaterVm.ReservationId).length, repeaterVm.ReservationId) == false)
                    {
                        DateTime dup = repeaterVm.EndDate;
                        duplicateDates.Add(dup);
                    }
                }
            }
            if (repeaterVm.Repetation == "years")
            {
                for (int i = 1; i < (repeaterVm.Appearance - 1) * repeaterVm.Interval; i++)
                {
                    repeaterVm.EndDate = startDate.AddYears(i * repeaterVm.Interval);
                    if (_reservationRepository.CanMakeReservation(_reservationRepository.GetItem(repeaterVm.ReservationId).RoomId,
                        repeaterVm.EndDate, _reservationRepository.GetItem(repeaterVm.ReservationId).length, repeaterVm.ReservationId) == false)
                    {
                        DateTime dup = repeaterVm.EndDate;
                        duplicateDates.Add(dup);
                    }
                }
            }

            #endregion



            if (duplicateDates.Count > 0)
            {
                foreach (var duplicateDate in duplicateDates)
                {
                    var test = _reservationChangesRepository.GetChangesByReservationAndDate(repeaterVm.ReservationId, duplicateDate);
                    if (test == null)
                    {
                        RoomReservationChanges changesVm = new RoomReservationChanges();
                        changesVm.RoomReservationId = repeaterVm.ReservationId;
                        changesVm.dateTime = duplicateDate;
                        SaveData(() =>
                        {
                            _reservationChangesRepository.Add(changesVm);
                        });
                    }
                    else continue;
                }
                var duplicates = _mapper.Map<List<DateTime>>(duplicateDates);
                this.Response.StatusCode = (int)HttpStatusCode.Conflict;
                return this.Json(_mapper.Map<List<DateTime>>(duplicates));
            }
            else
            {
                return Ok();
            }


        }




        #endregion


        #region Helpers

        private IActionResult CreateNewReservation(RoomReservationViewModel reservationVm)
        {
            reservationVm.UserId = GetUserId();
            Models.Reservation.RoomReservation reservation = _mapper.Map<Models.Reservation.RoomReservation>(reservationVm);

            return SaveData(() =>
            {
                _reservationRepository.Add(reservation);
            },
            () =>
            {
                this.Response.StatusCode = (int)HttpStatusCode.Created;

                return this.Json(new JsonResult(this.Json(_mapper.Map<RoomReservationViewModel>(reservation)))
                {
                    StatusCode = this.Response.StatusCode
                });
            });

        }



        private IActionResult SaveData(Action beforeAction)
        {
            return SaveData(beforeAction, () => this.Json(null));
        }



        private IActionResult SaveData(Action beforeAction, Func<IActionResult> result)
        {
            try
            {
                beforeAction();
                _reservationRepository.Save();
                return result();
            }
            catch (Exception ex)
            {
                _logger.LogError("Exception occured when saving data.", ex);
                this.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return this.Json(new { Message = $"Saving data throw Exception '{ex.Message}'" });
            }
        }



        public int GetUserId()
        {
            var claims = User.Claims.Select(claim => new { claim.Type, claim.Value }).ToArray();
            var userId = claims[0].Value;
            int id;
            int.TryParse(userId, out id);
            return id;
        }


        #endregion
    }
}
