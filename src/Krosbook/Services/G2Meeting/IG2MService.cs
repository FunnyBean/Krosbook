using Krosbook.ViewModels.Rooms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.Services.G2Meeting
{
    public interface IG2MService
    {
        string getUpcomingMeetings();

        void createNewMeeting(RoomReservationViewModel roomResVM);
    }
}
