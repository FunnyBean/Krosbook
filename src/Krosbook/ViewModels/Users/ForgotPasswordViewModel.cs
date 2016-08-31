using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.ViewModels.Users
{
    public class ForgotPasswordViewModel
    {
        [Required()]
        [MaxLength(100)]
        public string Email { get; set; }
    }
}
