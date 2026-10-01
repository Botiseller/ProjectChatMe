using System;
using System.Collections.Generic;

using Business.Entities;
using ChatbotDesarrollo.Core.Facade;
using ChatbotDesarrollo.Core.Manager;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Logic
{
    public sealed class ChatLogic : EntityLogic<Chats, ChatManager, Chatbot_DesarrolloEntities>
    {
        public Chat GetChat(int chatId)
        {
            return DefaultManager.GetChat(chatId);
        }

        public List<Message> GetMessages(int chatId, int beforeId)
        {
            return DefaultManager.GetMessages(chatId, beforeId);
        }

        public Message SendMessage(int chatId, Message message)
        {
            return DefaultManager.SendMessage(chatId, message);
        }

        public int MarkAsRead(int chatId)
        {
            return DefaultManager.MarkAsRead(chatId);
        }
    }
}

