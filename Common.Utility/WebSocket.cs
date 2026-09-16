using Common.Utility.Extensions;
using DocumentFormat.OpenXml.Office2010.Excel;
using Newtonsoft.Json;
using PusherServer;
using System;
using System.Linq;

namespace Common.Utility
{
    public static class WebSocket
    {

        public static void Trigger(string functionName, object param, string id) {
            try {
                
                PusherOptions options = new PusherOptions
                {
                    Cluster = Helper.GetWebSetingValue("Cluster"),
                    Encrypted = true
                };

                Pusher pusher = new Pusher(
                  Helper.GetWebSetingValue("AppId"),
                  Helper.GetWebSetingValue("Pusher"),
                  Helper.GetWebSetingValue("AppSecret"),
                  options);

                _ = pusher.TriggerAsync(
                  Helper.GetTokenBySession(),
                  functionName,
                  new { param, id });
            }
            catch { }

        }
        
        public static void Trigger(string functionName, string tokenId, Guid userId)
        {
            try
            {
                PusherOptions options = new PusherOptions
                {
                    Cluster = Helper.GetWebSetingValue("Cluster"),
                    Encrypted = true
                };

                    Pusher pusher = new Pusher(
                  Helper.GetWebSetingValue("AppId"),
                  Helper.GetWebSetingValue("Pusher"),
                  Helper.GetWebSetingValue("AppSecret"),
                  options);

                _ = pusher.TriggerAsync(
                  tokenId,
                  functionName,
                  new { id = userId.ToString() });
            }
            catch { }

        }

        public static void TriggerChunk(string functionName, object param, Guid id)
        {
            try
            {

                var json = JsonConvert.SerializeObject(param);

                PusherOptions options = new PusherOptions
                {
                    Cluster = Helper.GetWebSetingValue("Cluster"),
                    Encrypted = true
                };

                Pusher pusher = new Pusher(
                  Helper.GetWebSetingValue("AppId"),
                  Helper.GetWebSetingValue("Pusher"),
                  Helper.GetWebSetingValue("AppSecret"),
                  options);



                var i = 0;
                var chunkSize = 5000;
                var chunks = Enumerable.Range(0, (json.Length + chunkSize - 1) / chunkSize)
                            .Select(x => json.Substring(x * chunkSize, Math.Min(chunkSize, json.Length - x * chunkSize)))
                            .ToList();

                foreach (var item in chunks)
                {
                    var o = new
                    {
                        Chunk = item,
                        Index = i,
                        To = chunks.Count() - 1,
                        TriggerId = id,
                        FunctionName = functionName
                    };

                    var result = pusher.TriggerAsync(Helper.GetTokenBySession(), "EventSocketChunk", JsonConvert.SerializeObject(o)).Result;
                    i++;
                }

            }
            catch { }

        }

        public static void TriggerChat(string functionName, Guid leadBotId, string externalData, object param = null)
        {
            try
            {

                PusherOptions options = new PusherOptions
                {
                    Cluster = Helper.GetWebSetingValue("Cluster"),
                    Encrypted = true
                };

                Pusher pusher = new Pusher(
                  Helper.GetWebSetingValue("AppId"),
                  Helper.GetWebSetingValue("Pusher"),
                  Helper.GetWebSetingValue("AppSecret"),
                  options);

                _ = pusher.TriggerAsync(
                  Helper.GetTokenBySession(),
                  functionName,
                  new { leadBotId, externalData, param });
            }
            catch { }

        }

        public static void TriggerAdapt(string connect, string functionName, object data) {
            try
            {

                PusherOptions options = new PusherOptions
                {
                    Cluster = Helper.GetWebSetingValue("Cluster"),
                    Encrypted = true
                };

                Pusher pusher = new Pusher(
                  Helper.GetWebSetingValue("AppId"),
                  Helper.GetWebSetingValue("Pusher"),
                  Helper.GetWebSetingValue("AppSecret"),
                  options);

                _ = pusher.TriggerAsync(
                  connect,
                  functionName,
                  new { data });
            }
            catch { }

        }
    }
}
