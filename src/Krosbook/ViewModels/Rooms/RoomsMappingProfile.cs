using AutoMapper;
using Krosbook.Models;
using Krosbook.Models.Rooms;

namespace Krosbook.ViewModels.Rooms
{
    /// <summary>
    /// Initialization model to view model and revers mapping for rooms.
    /// </summary>
    public class RoomsMappingProfile : Profile
    {

        protected override void Configure()
        {
            this.CreateMap<Room, RoomViewModel>().ReverseMap().
                AfterMap((m, vm) =>
                {
                    foreach (var equipment in vm.Equipment)
                    {
                        equipment.RoomId = m.Id;
                    }
                });
            this.CreateMap<Equipment, EquipmentViewModel>().ReverseMap();
            this.CreateMap<RoomEquipment, RoomEquipmentViewModel>().
                ForMember(vm => vm.Description, map => map.MapFrom(m => m.Equipment.Description)).
                ReverseMap();
        }
    }
}
