using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Krosbook.Services.Email;
using System.Collections.Generic;
using Krosbook.Controllers.Api.v1;
using Krosbook.Resources;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

namespace Krosbook.Controllers.Api.v1
{

    [Route("api/email")]
    [EnableCors("AllowAll")]
    public class EmailController : BaseController
    {

        #region Private members

        private IEmailService _emailService;
        private IEmailCreator _creator;
        private IEmailSender _sender;
        private readonly IHostingEnvironment _appEnvironment;

        #endregion


        public EmailController(IEmailService emailService, IEmailCreator creator, IEmailSender sender, IHostingEnvironment appEnvironment)
        {
            _emailService = emailService;
            _creator = creator;
            _sender = sender;
            _appEnvironment = appEnvironment;
        }


        [HttpGet]
        [Route("send/")]
        public  void Send()
        {
         //   CreateCalendarEvent();         
      
           

            /*  var data = new BaseEmailData(emailType);
              data.From = Resources.Resources.EmailFrom;
              data.To.Add(to);

              var msg = _creator.CreateEmail(data);
         }     _sender.SendEmail(msg);*/

        }

        [HttpGet]
        [Route("PasswordReset")]
        public void PasswordReset(string to)
        {
            var data = new PasswordResetData(@"http://example.com");
            data.From = Resources.Resources.EmailFrom;
            data.To.Add(to);
            var msg = _creator.CreateEmail(data);
            _sender.SendEmail(msg);
        }

        [HttpGet]
        [Route("PasswordReset2")]
        public void PasswordReset2(string to)
        {
            _emailService.SendPasswordReset(to, @"http://example.com");
        }





    }
}
