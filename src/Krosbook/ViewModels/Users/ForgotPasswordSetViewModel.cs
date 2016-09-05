using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Krosbook.ViewModels.Users
{
    public class ForgotPasswordSetViewModel
    {
        [Required()]
        [MaxLength(20)]
        public string token { get; set; }

        [Required()]
        [MaxLength(100)]
        public string newPassword { get; set; }
    }
}
