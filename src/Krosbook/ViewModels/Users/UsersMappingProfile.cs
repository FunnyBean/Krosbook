﻿using AutoMapper;
using Krosbook.Models;
using Krosbook.Models.Users;

namespace Krosbook.ViewModels.Users
{
    /// <summary>
    /// Initialization model to view model and revers mapping for users.
    /// </summary>
    public class UsersMappingProfile : Profile
    {

        protected override void Configure()
        {
            this.CreateMap<User, UserViewModel>().ReverseMap().
                AfterMap((m, vm) =>
                {
                    foreach (var role in vm.Roles)
                    {
                        role.UserId = m.Id;
                    }
                });
            this.CreateMap<Role, RoleViewModel>().ReverseMap();
            this.CreateMap<UserRole, UserRoleViewModel>().ReverseMap();
           
        }
    }
}
