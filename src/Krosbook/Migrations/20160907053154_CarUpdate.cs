using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Krosbook.Migrations
{
    public partial class CarUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Car",
                maxLength: 7,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Car",
                maxLength: 100,
                nullable: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "Car");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Car",
                maxLength: 20,
                nullable: false);
        }
    }
}
