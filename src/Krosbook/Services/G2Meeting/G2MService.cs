using Krosbook.ViewModels.Rooms;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Krosbook.Services.G2Meeting
{
    public class G2MService: IG2MService
    {


        public void createNewMeeting(RoomReservationViewModel roomResVM) {

        }



        public string getUpcomingMeetings() {
            var request = (HttpWebRequest)WebRequest.Create("https://api.citrixonline.com/oauth/access_token");

            var postData = "grant_type=password&user_id=it@kros.sk&password=21krosaci12&client_id=kHFkMQquDNQJMINHl07891ypZiqtidzT";
            var data = Encoding.ASCII.GetBytes(postData);

            request.Method = "POST";
            request.Accept = "application/json";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = data.Length;

            using (var stream = request.GetRequestStream())
            {
                stream.Write(data, 0, data.Length);
            }

            var response = (HttpWebResponse)request.GetResponse();
            var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
            //    var json = new JsonConvert();
            var jsonDictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(responseString);
            var url = string.Format("https://api.citrixonline.com/G2M/rest/upcomingMeetings"); //, jsonDictionary["organizer_key"], jsonDictionary["access_token"]);
            var webRequest = WebRequest.Create(url) as HttpWebRequest;
            webRequest.Accept = "application/json";
            webRequest.ContentType = "application/json";
            webRequest.Headers.Add(HttpRequestHeader.Authorization, string.Format("OAuth oauth_token={0}", jsonDictionary["access_token"]));
            response = webRequest.GetResponse() as HttpWebResponse;
            using (var reader = new StreamReader(response.GetResponseStream()))
            {
                return reader.ReadToEnd();
            }
        }






    }
}
