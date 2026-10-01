using System.Collections.Generic;
using Business.Dto.Dtos.Chats;
using Business.Entities;

namespace Business.Contracts.Service
{
    public interface IChatBusinessService
    {
        Chat create(Chat chat);
        List<Chat> GetLote(int lote);
        Chat GetChat(int chatId);
        List<Message> GetMessages(int chatId, int beforeId);
        Message SendMessage(SendMessageDto request);
        int MarkAsRead(int chatId);
        Chat Get(int shopId, int userId);
    }
}
