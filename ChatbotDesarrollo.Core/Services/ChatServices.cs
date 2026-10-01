using System.Collections.Generic;
using Business.Entities;
using ChatbotDesarrollo.Core.Logic;
using ChatbotDesarrollo.Core.Manager;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Services
{
    public class ChatServices : EntityServices<Chats, ChatManager, ChatLogic, Chatbot_DesarrolloEntities>
    {
        public Chat create(Chat chat)
        {
            return DefaultLogic.DefaultManager.create(chat);
        }

        public List<Chat> GetLote(int lote)
        {
            return DefaultLogic.DefaultManager.GetLote(lote);
        }

        public Chat GetChat(int chatId)
        {
            return DefaultLogic.GetChat(chatId);
        }

        public List<Message> GetMessages(int chatId, int beforeId)
        {
            return DefaultLogic.GetMessages(chatId, beforeId);
        }

        public Message SendMessage(int chatId, Message message)
        {
            return DefaultLogic.SendMessage(chatId, message);
        }

        public int MarkAsRead(int chatId)
        {
            return DefaultLogic.MarkAsRead(chatId);
        }

        public Chat Get(int shopId, int userId) {
            return DefaultLogic.DefaultManager.Get(shopId, userId);
        }
    }
}


