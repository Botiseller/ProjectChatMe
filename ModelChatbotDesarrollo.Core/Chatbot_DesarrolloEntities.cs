using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace ModelChatbotDesarrollo.Core
{
    public partial class Chatbot_DesarrolloEntities : DbContext, IObjectContextAdapter
    {
        public Chatbot_DesarrolloEntities(string connString)
            : base(connString)
        {

        }
    }
}