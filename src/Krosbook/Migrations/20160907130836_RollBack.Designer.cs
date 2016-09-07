using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Krosbook.Models;

namespace Krosbook.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20160907130836_RollBack")]
    partial class RollBack
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.0.0-rtm-21431")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Krosbook.Models.Cars.Car", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Color")
                        .HasAnnotation("MaxLength", 7);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("Plate")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 20);

                    b.HasKey("Id");

                    b.HasIndex("Plate")
                        .IsUnique();

                    b.ToTable("Car");
                });

            modelBuilder.Entity("Krosbook.Models.Reservation.CarReservation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CarId");

                    b.Property<DateTime>("DateTimeEnd");

                    b.Property<DateTime>("DateTimeStart");

                    b.Property<string>("Destination");

                    b.Property<bool>("GPSSystem");

                    b.Property<bool>("PrivateUse");

                    b.Property<string>("Requirements");

                    b.Property<int>("ReservationState");

                    b.Property<string>("TravelInsurance");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("CarId");

                    b.HasIndex("UserId");

                    b.ToTable("CarReservation");
                });

            modelBuilder.Entity("Krosbook.Models.Reservation.RoomReservation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("G2MeetingID");

                    b.Property<int>("RoomId");

                    b.Property<int?>("RoomReservationRepeaterId");

                    b.Property<int>("UserId");

                    b.Property<DateTime>("dateTime");

                    b.Property<int>("length");

                    b.Property<string>("name");

                    b.HasKey("Id");

                    b.HasIndex("RoomId");

                    b.HasIndex("RoomReservationRepeaterId")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("RoomReservation");
                });

            modelBuilder.Entity("Krosbook.Models.Reservation.RoomReservationChanges", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("RoomReservationId");

                    b.Property<DateTime>("dateTime");

                    b.HasKey("Id");

                    b.HasIndex("RoomReservationId");

                    b.ToTable("RoomReservationChanges");
                });

            modelBuilder.Entity("Krosbook.Models.Reservation.RoomReservationRepeater", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("EndDate");

                    b.Property<int>("Interval");

                    b.Property<string>("Repetation");

                    b.Property<int>("ReservationId");

                    b.HasKey("Id");

                    b.HasIndex("ReservationId")
                        .IsUnique();

                    b.ToTable("RoomReservationRepeater");
                });

            modelBuilder.Entity("Krosbook.Models.Rooms.Equipment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.HasKey("Id");

                    b.ToTable("Equipment");
                });

            modelBuilder.Entity("Krosbook.Models.Rooms.Room", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 7);

                    b.Property<string>("Description")
                        .HasAnnotation("MaxLength", 255);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 25);

                    b.HasKey("Id");

                    b.ToTable("Room");
                });

            modelBuilder.Entity("Krosbook.Models.Rooms.RoomEquipment", b =>
                {
                    b.Property<int>("EquipmentId");

                    b.Property<int>("RoomId");

                    b.Property<decimal>("Amount");

                    b.HasKey("EquipmentId", "RoomId");

                    b.HasIndex("EquipmentId");

                    b.HasIndex("RoomId");

                    b.ToTable("RoomEquipment");
                });

            modelBuilder.Entity("Krosbook.Models.Users.RememberMe", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Selector");

                    b.Property<string>("ValidatorHash");

                    b.Property<int>("userId");

                    b.HasKey("Id");

                    b.HasIndex("userId");

                    b.ToTable("RememberMe");
                });

            modelBuilder.Entity("Krosbook.Models.Users.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Role");
                });

            modelBuilder.Entity("Krosbook.Models.Users.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DateCreated");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<bool>("IsLocked");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("PasswordHash")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<byte[]>("Photo");

                    b.Property<DateTime>("ResetPasswordDateTime");

                    b.Property<string>("ResetPasswordToken");

                    b.Property<string>("Surname")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("User");
                });

            modelBuilder.Entity("Krosbook.Models.Users.UserRole", b =>
                {
                    b.Property<int>("UserId");

                    b.Property<int>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.HasIndex("UserId");

                    b.ToTable("UserRole");
                });

            modelBuilder.Entity("Krosbook.Models.Reservation.CarReservation", b =>
                {
                    b.HasOne("Krosbook.Models.Cars.Car", "Car")
                        .WithMany("Reservations")
                        .HasForeignKey("CarId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Krosbook.Models.Users.User", "User")
                        .WithMany("Cars")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Krosbook.Models.Reservation.RoomReservation", b =>
                {
                    b.HasOne("Krosbook.Models.Rooms.Room", "Room")
                        .WithMany("Reservations")
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Krosbook.Models.Reservation.RoomReservationRepeater", "RoomReservationRepeater")
                        .WithOne("RoomReservation")
                        .HasForeignKey("Krosbook.Models.Reservation.RoomReservation", "RoomReservationRepeaterId");

                    b.HasOne("Krosbook.Models.Users.User", "User")
                        .WithMany("Rooms")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Krosbook.Models.Reservation.RoomReservationChanges", b =>
                {
                    b.HasOne("Krosbook.Models.Reservation.RoomReservation", "RoomReservation")
                        .WithMany("ReservationsChanges")
                        .HasForeignKey("RoomReservationId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Krosbook.Models.Rooms.RoomEquipment", b =>
                {
                    b.HasOne("Krosbook.Models.Rooms.Equipment", "Equipment")
                        .WithMany("Rooms")
                        .HasForeignKey("EquipmentId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Krosbook.Models.Rooms.Room", "Room")
                        .WithMany("Equipment")
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Krosbook.Models.Users.RememberMe", b =>
                {
                    b.HasOne("Krosbook.Models.Users.User", "user")
                        .WithMany("rememberMe")
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Krosbook.Models.Users.UserRole", b =>
                {
                    b.HasOne("Krosbook.Models.Users.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Krosbook.Models.Users.User", "User")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
