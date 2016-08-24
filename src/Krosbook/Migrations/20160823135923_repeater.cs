using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Krosbook.Migrations
{
    public partial class repeater : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
         
            migrationBuilder.CreateTable(
                name: "RoomReservationRepeater",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EndDate = table.Column<DateTime>(nullable: false),
                    Interval = table.Column<int>(nullable: false),
                    Repetation = table.Column<string>(nullable: true),
                    ReservationId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomReservationRepeater", x => x.Id);
                });

         

            migrationBuilder.CreateTable(
                name: "RoomReservation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    G2MeetingID = table.Column<int>(nullable: false),
                    RoomId = table.Column<int>(nullable: false),
                    RoomReservationRepeaterId = table.Column<int>(nullable: true),
                    UserId = table.Column<int>(nullable: false),
                    dateTime = table.Column<DateTime>(nullable: false),
                    length = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomReservation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoomReservation_Room_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Room",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoomReservation_RoomReservationRepeater_RoomReservationRepeaterId",
                        column: x => x.RoomReservationRepeaterId,
                        principalTable: "RoomReservationRepeater",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RoomReservation_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

          

            migrationBuilder.CreateIndex(
                name: "IX_RoomReservation_RoomId",
                table: "RoomReservation",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_RoomReservation_RoomReservationRepeaterId",
                table: "RoomReservation",
                column: "RoomReservationRepeaterId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoomReservation_UserId",
                table: "RoomReservation",
                column: "UserId");

      
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
           
            migrationBuilder.DropTable(
                name: "RoomReservation");

          
            migrationBuilder.DropTable(
                name: "RoomReservationRepeater");

       
        }
    }
}
