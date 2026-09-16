using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;
using System.Linq;

namespace ChatbotDesarrollo.Core.Manager
{
    public sealed class SharedManager : EntityManager<ChatsExample, Chatbot_DesarrolloEntities>
    {
       

        internal string ConseguirUniqueString()
        {
         
                return Context.ChatsExample.Select(c=> c.Nombre).FirstOrDefault();
         
        }



    }
}