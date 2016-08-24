using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Krosbook.Migrations
{
    public partial class unique : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {


            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                table: "RoomReservationRepeater",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<int>(
                name: "ReservationId",
                table: "RoomReservationRepeater",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_RoomReservationRepeater_ReservationId",
                table: "RoomReservationRepeater",
                column: "ReservationId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RoomReservationRepeater_ReservationId",
                table: "RoomReservationRepeater");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "RoomReservationRepeater");

            migrationBuilder.AddColumn<int>(
                name: "Appearance",
                table: "RoomReservationRepeater",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "ReservationId",
                table: "RoomReservationRepeater",
                nullable: true);
        }
    }
}
