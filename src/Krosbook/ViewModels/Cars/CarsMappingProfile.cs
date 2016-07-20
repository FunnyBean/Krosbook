using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Krosbook.Models;
using Krosbook.Models.Cars;
using AutoMapper;

namespace Krosbook.ViewModels.Cars
{
    public class CarsMappingProfile : Profile
    {
        protected override void Configure()
        {
            this.CreateMap<Car, CarViewModel>().ReverseMap();         
        }
    }
}
