﻿using Krosbook.Services.Template;
using Krosbook.ViewModels.Rooms;

namespace Krosbook.Services.Email
{
    /// <summary>
    /// Service for sending all email types.
    /// </summary>
    public interface IEmailService
    {

        /// <summary>
        /// Sends an email for resetting user's password.
        /// </summary>
        /// <param name="to">Email address of recepient.</param>
        /// <param name="resetLink">Link, where user can reset his password.</param>
        void SendPasswordReset(string to, string resetLink);

        void SendRoomReservation(string title, string emailTo, string filename);
        void CreateEmailCalendarEvent(RoomReservationViewModel rvm);

    }
}