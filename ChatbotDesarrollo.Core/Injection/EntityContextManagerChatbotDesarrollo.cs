using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Injection
{
    /// <summary>
    /// Entity Context Manager injected by Unity
    /// </summary>
    public class EntityContextManagerChatbotDesarrollo : EntityContextManagerWithParam<Chatbot_DesarrolloEntities>
    {
        public EntityContextManagerChatbotDesarrollo(string connectionString) : base(connectionString)
        {
   
        }
    }
}
