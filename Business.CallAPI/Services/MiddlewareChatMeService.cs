using System.Collections.Generic;
using Business.Dto.Dtos.Apis;
using Business.Dto.Dtos.Authentication;
using Business.Dto.Dtos.Chats;
using Business.Entities;
using Business.Entities.Security;
using Common.CallApi;

namespace Business.CallAPI.Services
{
    public class MiddlewareChatMeService
    {
        HttpClientWrapper webApiChatMe = new HttpClientWrapper();
        public AuthenticationCall authentication = new AuthenticationCall();
        public ShopCall shop = new ShopCall();
        public ChatCall chat = new ChatCall();

        public UserCall user = new UserCall();

        public MiddlewareChatMeService()
        {
            webApiChatMe.CreateApiChatMe();
            authentication.createEnvironment(webApiChatMe);
            shop.createEnvironment(webApiChatMe);
            chat.createEnvironment(webApiChatMe);
            user.createEnvironment(webApiChatMe);
        }

        #region "Authentication"
        public class AuthenticationCall {
            HttpClientWrapper webApiChatMe = new HttpClientWrapper();
            public void createEnvironment(HttpClientWrapper _webApiChatMe) { 
                webApiChatMe = _webApiChatMe;
            }

            public Session loggin(AuthenticationDto authentication)
            {
                return webApiChatMe.CallPost<Session>(() => new MethodParameters
                {
                    Action = "Loggin",
                    Controller = "Security",
                    Params = authentication,
                    Anonymous = AnonymousType.None
                });

            }


            //Los tres pasos del login por SMS van con AnonymousType.WithoutCredential: son anteriores al login, no hay
            //sesion en el hilo, y sin identidad HttpClientMessageHandnler no manda el X-ClientCode. El API lo necesita
            //igual aunque venga vacio, porque de ese header sale la conexion a la base (ver InternalHeaderFactory).
            public void requestCode(RequestCodeDto request)
            {
                webApiChatMe.CallPost<object>(() => new MethodParameters
                {
                    Action = "RequestCode",
                    Controller = "Security",
                    Params = request,
                    Anonymous = AnonymousType.WithoutCredential
                });

            }

            public LoginResult verifyCode(VerifyCodeDto request)
            {
                return webApiChatMe.CallPost<LoginResult>(() => new MethodParameters
                {
                    Action = "VerifyCode",
                    Controller = "Security",
                    Params = request,
                    Anonymous = AnonymousType.WithoutCredential
                });

            }

            public LoginResult completeProfile(CompleteProfileDto request)
            {
                return webApiChatMe.CallPost<LoginResult>(() => new MethodParameters
                {
                    Action = "CompleteProfile",
                    Controller = "Security",
                    Params = request,
                    Anonymous = AnonymousType.WithoutCredential
                });

            }


            public Authentication getToken(string code, string secret, string tokenProveedor)
            {
                return webApiChatMe.Call<Authentication>(() => new MethodParameters
                {
                    Action = "Token",
                    Controller = "Security",
                    Params = new { code, secret, tokenProveedor },
                    Anonymous = AnonymousType.None
                });

            }

            public Provider getProvider(string code)
            {
                return webApiChatMe.Call<Provider>(() => new MethodParameters
                {
                    Action = "Provider",
                    Controller = "Security",
                    Params = new { code },
                    Anonymous = AnonymousType.None
                });

            }

        }

        #endregion

        #region "Shop"

        public class ShopCall
        {
            HttpClientWrapper webApiChatMe = new HttpClientWrapper();
            public void createEnvironment(HttpClientWrapper _webApiChatMe)
            {
                webApiChatMe = _webApiChatMe;
            }

            public Shop search(string param)
            {
                return webApiChatMe.Call<Shop>(() => new MethodParameters
                {
                    Action = "Search",
                    Controller = "Shop",
                    Params = new { param }
                });

            }

            public Shop get(int Id)
            {
                return webApiChatMe.Call<Shop>(() => new MethodParameters
                {
                    Action = "Get",
                    Controller = "Shop",
                    Params = new { Id }
                });

            }

            public Shop get(string code)
            {
                return webApiChatMe.Call<Shop>(() => new MethodParameters
                {
                    Action = "GetByCode",
                    Controller = "Shop",
                    Params = new { code }
                });

            }

        }


        #endregion

        #region "Chat"

        public class ChatCall
        {
            HttpClientWrapper webApiChatMe = new HttpClientWrapper();
            public void createEnvironment(HttpClientWrapper _webApiChatMe)
            {
                webApiChatMe = _webApiChatMe;
            }

            public Chat Create(Chat chat)
            {
                return webApiChatMe.CallPost<Chat>(() => new MethodParameters
                {
                    Action = "Create",
                    Controller = "Chat",
                    Params = chat
                });

            }

            //Un solo metodo para cualquier mensaje: solo texto, solo archivo, o los dos. Si el DTO trae Content, ese
            //byte[] viaja como base64 dentro del JSON (Newtonsoft lo hace solo), sin necesidad de multipart contra el API.
            public Message SendMessage(SendMessageDto request)
            {
                return webApiChatMe.CallPost<Message>(() => new MethodParameters
                {
                    Action = "SendMessage",
                    Controller = "Chat",
                    Params = request
                });

            }

            //Devuelve cuantos mensajes quedaron marcados. El chatId va como valor suelto en el body, que es lo que
            //espera Chat/MarkAsRead con su [FromBody].
            public int MarkAsRead(int chatId)
            {
                return webApiChatMe.CallPost<int>(() => new MethodParameters
                {
                    Action = "MarkAsRead",
                    Controller = "Chat",
                    Params = chatId
                });

            }

            public List<Message> GetMessages(int chatId, int beforeId)
            {
                return webApiChatMe.Call<List<Message>>(() => new MethodParameters
                {
                    Action = "GetMessages",
                    Controller = "Chat",
                    Params = new { chatId, beforeId }
                });

            }

            public List<Chat> GetLote(int lote)
            {
                return webApiChatMe.Call<List<Chat>>(() => new MethodParameters
                {
                    Action = "GetLote",
                    Controller = "Chat",
                    Params = new { lote }
                });

            }

            public Chat Get(int shopId, int userId)
            {
                return webApiChatMe.Call<Chat>(() => new MethodParameters
                {
                    Action = "GetChat",
                    Controller = "Chat",
                    Params = new { shopId, userId }
                });

            }

            
            

        }


        #endregion

        #region "User"

        public class UserCall
        {
            HttpClientWrapper webApiChatMe = new HttpClientWrapper();
            public void createEnvironment(HttpClientWrapper _webApiChatMe)
            {
                webApiChatMe = _webApiChatMe;
            }

            public User SearchProvider(string userid, int providerId)
            {
                return webApiChatMe.Call<User>(() => new MethodParameters
                {
                    Action = "SearchProvider",
                    Controller = "User",
                    Params = new { userid, providerId }
                });

            }

           

        }

        #endregion



    }
}
