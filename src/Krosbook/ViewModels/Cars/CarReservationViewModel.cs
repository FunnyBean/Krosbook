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
        [Required()]
        public int Id { get; set; }
        [Required()]
        public int CarId { get; set; }
        [Required()]
        public int UserId { get; set; }
        [Required()]
        public DateTime dateTime { get; set; }

        [Required()]
        public int length { get; set; }

        [Required()]
        public string name { get; set; }
    }
}
