using System;
using System.Collections.Generic;
using Krosbook.Models.Base;
using Krosbook.Models.Rooms;
using Krosbook.Models.Users;

namespace Krosbook.Models.Rooms.Dummies
{
    /// <summary>
    /// Equipment dummy repository for testing
    /// </summary>
    /// <seealso cref="Krosbook.Models.IEquipmentRepository" />
    /// <seealso cref="Krosbook.Models.Base.BaseDummyRepository{T}" />
    public class UserDummyRepository : BaseDummyRepository<User>, IUserRepository
    {
        public User GetSingleByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public User GetSingleByUsername(string username)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Role> GetUserRoles(string username)
        {
            throw new NotImplementedException();
        }
    }
}
