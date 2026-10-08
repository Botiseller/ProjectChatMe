using System;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using Business.Entities.Security;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Manager
{
    //Acceso a la tabla SmsCodes por SQL directo y no por LINQ como el resto de los managers: la tabla todavia no
    //esta en el EDMX. Meterla a mano en el modelo es justo lo que rompe toda la aplicacion cuando queda a medias
    //(ver "EDMX traps" en CLAUDE.md), asi que hasta que se actualice el modelo desde la base esto va por afuera.
    //Context.Database.SqlQuery no necesita que la entidad este mapeada; cuando SmsCodes entre al EDMX, esta clase
    //pasa a ser EntityManager<SmsCodes, ...> con LINQ y el resto de las capas no se entera.
    //El tipo generico es Usuarios solo para heredar el Context; esta clase no toca Usuarios.
    public sealed class SmsCodeManager : EntityManager<Usuarios, Chatbot_DesarrolloEntities>
    {
        internal void create(SmsCode code)
        {
            Context.Database.ExecuteSqlCommand(
                "INSERT INTO SmsCodes (Telefono, Codigo, FechaAlta, FechaVence, Intentos) VALUES (@telefono, @codigo, @alta, @vence, 0)",
                new SqlParameter("@telefono", code.Telefono),
                new SqlParameter("@codigo", code.Codigo),
                new SqlParameter("@alta", DateTime.UtcNow),
                new SqlParameter("@vence", code.FechaVence));
        }

        //El ultimo codigo emitido para ese telefono, usado o no, vencido o no: quien decide si sirve es el business.
        internal SmsCode last(string phone)
        {
            return Context.Database.SqlQuery<SmsCode>(
                "SELECT TOP 1 SmsCodeId, Telefono, Codigo, FechaVence, FechaUso, Intentos FROM SmsCodes WHERE Telefono = @telefono ORDER BY SmsCodeId DESC",
                new SqlParameter("@telefono", phone)).FirstOrDefault();
        }

        internal void markUsed(int smsCodeId)
        {
            Context.Database.ExecuteSqlCommand(
                "UPDATE SmsCodes SET FechaUso = @uso WHERE SmsCodeId = @id",
                new SqlParameter("@uso", DateTime.UtcNow),
                new SqlParameter("@id", smsCodeId));
        }

        internal void addAttempt(int smsCodeId)
        {
            Context.Database.ExecuteSqlCommand(
                "UPDATE SmsCodes SET Intentos = Intentos + 1 WHERE SmsCodeId = @id",
                new SqlParameter("@id", smsCodeId));
        }
    }
}
