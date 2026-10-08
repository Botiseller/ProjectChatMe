using Business.Entities.Security;
using ChatbotDesarrollo.Core.Logic;
using ChatbotDesarrollo.Core.Manager;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Services
{
    public class SmsCodeServices : EntityServices<Usuarios, SmsCodeManager, SmsCodeLogic, Chatbot_DesarrolloEntities>
    {
        public void create(SmsCode code)
        {
            DefaultLogic.DefaultManager.create(code);
        }

        public SmsCode last(string phone)
        {
            return DefaultLogic.DefaultManager.last(phone);
        }

        public void markUsed(int smsCodeId)
        {
            DefaultLogic.DefaultManager.markUsed(smsCodeId);
        }

        public void addAttempt(int smsCodeId)
        {
            DefaultLogic.DefaultManager.addAttempt(smsCodeId);
        }
    }
}
