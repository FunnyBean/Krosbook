using Krosbook.Services.Template;
using Krosbook.Models.Reservation;
using Krosbook.Models.Cars;

namespace Krosbook.Services.Email
{
    /// <summary>
    /// Data for email message for resetting password.
    /// </summary>
    public class NewAccount : BaseEmailData
    {

        #region Constructors

        /// <summary>
        /// Initializes data with link for password reset <paramref name="title" />.
        /// </summary>
        /// <param name="title">Link where user can reset his password.</param>
        public NewAccount(string name, string surname, string token, System.DateTime deadline) : base("NewAccount")
        {
            this.name = name;
            this.surname = surname;
            this.passwordLink = "http://funnybean.cloudapp.net/passwordReset/" + token;
            this.deadline = deadline.AddMinutes(30).ToString("dd.MM.yyyy HH:mm");
        }

        #endregion


        #region General

        [TemplateVariable("name")]
        public string name { get; }

        [TemplateVariable("surname")]
        public string surname { get; set; }

        [TemplateVariable("passwordLink")]
        public string passwordLink { get; set; }

        [TemplateVariable("deadline")]
        public string deadline { get; set; }

        #endregion

    }
}
