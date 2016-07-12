using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Krosbook.Controllers.Api.v1
{
    [Route("api/todo")]
    public class MyController: BaseController
    {
        [HttpGet]
        [Route("login")]
        public IActionResult GetById()
        {         
            return new ObjectResult("Hura");
        }
    }
}
