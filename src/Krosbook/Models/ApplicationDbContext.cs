using Krosbook.Models.Cars;
using Krosbook.Models.Rooms;
using Krosbook.Models.Users;
using Krosbook.Models.Reservation;
using Microsoft.EntityFrameworkCore;

namespace Krosbook.Models
{
    public class ApplicationDbContext : DbContext
    {

        #region Constructor

        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        #endregion


        #region DbSets

        /// <summary>
        /// DbSet for rooms.
        /// </summary>
        public DbSet<Room> Room { get; set; }

        /// <summary>
        /// Gets or sets the equipment.
        /// </summary>
        public DbSet<Equipment> Equipment { get; set; }

        /// <summary>
        /// Gets or sets the room equipments.
        /// </summary>
        public DbSet<RoomEquipment> RoomEquipment { get; set; }

        /// <summary>
        /// DbSet for users.
        /// </summary>
        public DbSet<User> User { get; set; }

        /// <summary>
        /// DbSet for roles.
        /// </summary>
        public DbSet<Role> Role { get; set; }

        /// <summary>
        /// DbSet for user's roles.
        /// </summary>
        public DbSet<UserRole> UserRole { get; set; }
        /// <summary>
        /// DbSet for cars.
        /// </summary>
        public DbSet<Car> Car { get; set; }

        /// <summary>
        /// Gets or sets the room users reservation.
        /// </summary>
        public DbSet<RoomUser> RoomUser { get; set; }
        /// <summary>
        /// Gets or sets the room users reservation.
        /// </summary>
        public DbSet<CarUser> CarUser { get; set; }

        #endregion


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            OnRoomModelCreating(builder);
            OnUserModelCreating(builder);
            OnCarModelCreating(builder);
        }

        private void OnRoomModelCreating(ModelBuilder builder)
        {
            //builder.Entity<Room>().HasIndex(r => r.Name).IsUnique();
            //builder.Entity<Equipment>().HasIndex(e => e.Description).IsUnique();

            builder.Entity<RoomEquipment>().HasKey(re => new { re.EquipmentId, re.RoomId });

            builder.Entity<RoomEquipment>()
                .HasOne(re => re.Equipment)
                .WithMany(e => e.Rooms)
                .HasForeignKey(re => re.EquipmentId);

            builder.Entity<RoomEquipment>()
                .HasOne(re => re.Room)
                .WithMany(r => r.Equipment)
                .HasForeignKey(re => re.RoomId);



            builder.Entity<RoomUser>().HasKey(re => new {re.UserId, re.RoomId});


            builder.Entity<RoomUser>()
                .HasOne(re => re.Room)
                .WithMany(r => r.Reservations)
                .HasForeignKey(re => re.RoomId);
              

            builder.Entity<RoomUser>()
                .HasOne(re => re.User)
                .WithMany(r => r.Rooms)
                .HasForeignKey(re => re.UserId);

        }

        private void OnUserModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>().HasIndex(u => u.Email).IsUnique();     

            builder.Entity<Role>().HasIndex(r => r.Name).IsUnique();

            builder.Entity<UserRole>().HasKey(x => new { x.UserId, x.RoleId });

            builder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(ur => ur.Roles)
                .HasForeignKey(ur => ur.UserId);
            builder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(ur => ur.Users)
                .HasForeignKey(ur => ur.RoleId);
        }


        private void OnCarModelCreating(ModelBuilder builder) {
            builder.Entity<Car>().HasKey(r => r.Id);
            builder.Entity<Car>().HasIndex(r => r.Plate).IsUnique();



            builder.Entity<CarUser>().HasKey(re => new {re.Id });
    //        builder.Entity<CarUser>()
      //          .HasOne(re => re.User);
        //    builder.Entity<CarUser>()
          //     .HasOne(re => re.Car);
        }




    }
}
