using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Krosbook.Migrations
{
    public partial class CarsReservationUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dateTime",
                table: "CarReservation");

            migrationBuilder.DropColumn(
                name: "length",
                table: "CarReservation");

            migrationBuilder.DropColumn(
                name: "name",
                table: "CarReservation");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateTimeEnd",
                table: "CarReservation",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateTimeStart",
                table: "CarReservation",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Destination",
                table: "CarReservation",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "GPSSystem",
                table: "CarReservation",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PrivateUse",
                table: "CarReservation",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Requirements",
                table: "CarReservation",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TravelInsurance",
                table: "CarReservation",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateTimeEnd",
                table: "CarReservation");

            migrationBuilder.DropColumn(
                name: "DateTimeStart",
                table: "CarReservation");

            migrationBuilder.DropColumn(
                name: "Destination",
                table: "CarReservation");

            migrationBuilder.DropColumn(
                name: "GPSSystem",
                table: "CarReservation");

            migrationBuilder.DropColumn(
                name: "PrivateUse",
                table: "CarReservation");

            migrationBuilder.DropColumn(
                name: "Requirements",
                table: "CarReservation");

            migrationBuilder.DropColumn(
                name: "TravelInsurance",
                table: "CarReservation");

            migrationBuilder.AddColumn<DateTime>(
                name: "dateTime",
                table: "CarReservation",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "length",
                table: "CarReservation",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "CarReservation",
                nullable: true);
        }
    }
}
