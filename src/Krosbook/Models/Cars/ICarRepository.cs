using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Krosbook.Models.Base;

namespace Krosbook.Models.Cars
{
    public interface ICarRepository : IRepository<Car>
    {
        Car GetSingleByName(string name);

        Car GetSingleByPlate(string plate);
    }
}
