using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Business.Dto.Dtos.Authentication
{
    public class AuthenticationDto
    {
        public string userPhone { get; set; }
        public string userId { get; set; }
        public int businessId { get; set; }
        public string name { get; set; }
        public int provider { get; set; }
        public int exp { get; set; }
        public IList<HistoryDto> history { get; set; }
        
    }

    public class HistoryDto 
    {
        public HistoryFromDto from { get; set; }
        public string type { get; set; }
        public HistoryDetailDto message { get; set; }
        public string at { get; set; }
        [JsonProperty("id")]
        private string id { get; set; }
        public string GetExternalId(string provider)
        {
            if (!string.IsNullOrEmpty(provider) && !string.IsNullOrEmpty(id)) {
                return $"{provider}-{id}";
            }
            return null;
        }


    }

    public class HistoryFromDto {
        public string type { get; set; }
        public string pictureUrl { get; set; }
        public string name { get; set; }
    }


    public class HistoryDetailDto {
        public string Text { get; set; }
        public string Image { get; set; }
        public string Audio { get; set; }
        public string File { get; set; }
        public string Video { get; set; }
        public string Sticket { get; set; }
        public IList<HistoryDetailButtonDto> Buttons { get; set; }
    }

    public class HistoryDetailButtonDto
    {
        public string Text { get; set; }
        public string Payload { get; set; }
    }

}
