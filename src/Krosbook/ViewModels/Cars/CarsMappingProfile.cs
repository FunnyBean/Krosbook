using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Krosbook.Models;
using Krosbook.Models.Cars;
using AutoMapper;
using Krosbook.Models.Reservation;

namespace Krosbook.ViewModels.Cars
{
    public class CarsMappingProfile : Profile
    {
        protected override void Configure()
        {
            this.CreateMap<Car, CarViewModel>().ReverseMap()
                   .AfterMap((m, vm) =>
                   {
                       foreach (var reservation in vm.Reservations)
                       {
                           reservation.CarId = m.Id;
                       }
                   });
            this.CreateMap<CarReservation, CarReservationViewModel>().ReverseMap();
        }
    }
}
