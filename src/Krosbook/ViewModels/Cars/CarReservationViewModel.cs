using Krosbook.Models.Reservation;
using Krosbook.Models.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.ViewModels.Cars
{
    public class CarReservationViewModel
    {
        public int Id { get; set; }

        public int CarId { get; set; }

        public int UserId { get; set; }
   
        public DateTime dateTime { get; set; }
    }
}
