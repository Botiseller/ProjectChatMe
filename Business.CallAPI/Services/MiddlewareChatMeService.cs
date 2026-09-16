using Common.CallApi;

namespace Business.CallAPI.Services
{
    public class MiddlewareChatMeService
    {
        HttpClientWrapper webApiChatMe = new HttpClientWrapper();

        public MiddlewareChatMeService()
        {
            webApiChatMe.CreateApiChatMe();
        }

        public string ConseguirUniqueString()
        {
            return webApiChatMe.Call<string>(() => new MethodParameters
            {
                Action = "ConseguirUniqueString",
                Controller = "Shared"
            });

        }

    }
}
