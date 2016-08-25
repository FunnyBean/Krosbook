using Krosbook.Models.Reservation;
using Krosbook.Models.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.ViewModels.Cars
{
    public class CarReservationViewModel
    {
   
        public int Id { get; set; }
  
        public int CarId { get; set; }
    
        public int UserId { get; set; }

        public string dateStart { get; set; }

        public string dateEnd { get; set; }

        public DateTime DateTimeStart { get; set; }

        public DateTime DateTimeEnd { get; set; }

        public string Destination { get; set; }

        public string TravelInsurance { get; set; }

        public Boolean GPSSystem { get; set; }

        public string Requirements { get; set; }

        public Boolean PrivateUse { get; set; }

        public int ReservationState { get; set; }
    }
}
