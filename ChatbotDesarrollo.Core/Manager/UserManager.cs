using System;
using System.CodeDom;
using System.Data.Entity.Migrations;
using System.Linq;
using Business.Entities;
using Business.Entities.Security;
using Common.Utility;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Manager
{
    public sealed class UserManager : EntityManager<Usuarios, Chatbot_DesarrolloEntities>
    {
        internal User search(string param) {
            User user = null;

            //El telefono se compara sin separadores de los dos lados: el guardado puede venir como "+54 9 11 5555-5555"
            //y el buscado como "5491155555555". Replace, no Remove: Remove(char) no existe, el char se convierte a int
            //y termina siendo Remove(startIndex), que revienta con cualquier texto mas corto que ese indice.
            var phone = (param ?? string.Empty).Replace("-", "").Replace("+", "").Replace(" ", "");

            var u = Context.Usuarios.Where(x => x.Nombre.Contains(param) ||
                                                x.Telefono.Replace("-", "").Replace("+", "").Replace(" ", "") == phone ||
                                                x.Mail.Contains(param)).FirstOrDefault();

            if (u != null) {
                user = Common.Utility.Helper.DeserializeObject<User>(u.Usuario);
                user.UsuarioId = u.UsuarioId;
            }
               
                
            return user;
        }

        //Busqueda del login: solo por telefono y por igualdad. search(param) de arriba tambien compara contra Nombre
        //y Mail con Contains, que para entrar al sistema es peligroso - un telefono podria caer dentro del nombre de
        //otro usuario y devolver una cuenta ajena.
        internal User searchByPhone(string phone)
        {
            var normalizado = (phone ?? string.Empty).Replace("-", "").Replace("+", "").Replace(" ", "");

            var u = Context.Usuarios
                           .Where(x => x.Telefono.Replace("-", "").Replace("+", "").Replace(" ", "") == normalizado)
                           .FirstOrDefault();

            return u == null ? null : get(u.UsuarioId);
        }

        //Guarda los datos que el usuario completa al entrar por primera vez. Las columnas y el JSON de Usuarios.Usuario
        //se escriben juntos porque los dos se leen despues: get() toma el nombre de la columna y el resto del JSON.
        internal User update(User user)
        {
            var u = Context.Usuarios.Where(x => x.UsuarioId == user.UsuarioId).FirstOrDefault();
            if (u == null) return null;

            u.Nombre = user.Nombre;
            u.Mail = user.Mail;
            u.Telefono = user.Telefono;
            u.Usuario = Common.Utility.Helper.SerializeObject(user);

            SaveChanges();

            return user;
        }

        public User search(string userId, int providerId)
        {
            var up = Context.UsuarioProveedor
                            .Where(x => x.UsuarioProveedorId == userId && x.ProveedorId == providerId)
                            .FirstOrDefault();

            return up == null ? null : get(up.UsuarioId);
        }

        internal User create(User user)
        {
            var u = new Usuarios()
            {
                Nombre = user.Nombre,
                Telefono = user.Telefono,
                Mail = user.Mail,
                FechaAlta = DateTime.UtcNow,
                Usuario = Common.Utility.Helper.SerializeObject(user)
            };
            Context.Usuarios.Add(u);
            SaveChanges();

            var latestUser = Context.Usuarios.OrderByDescending(x => x.FechaAlta).FirstOrDefault();
            user.UsuarioId = latestUser.UsuarioId;

            return user;

        }

        internal User get(int id)
        {
            User user = null;
            var u = Context.Usuarios.Where(x => x.UsuarioId == id).FirstOrDefault();

            if (u != null)
            {
                //Las columnas mandan sobre el JSON de Usuarios.Usuario, que puede estar vacio o desactualizado: el
                //nombre lo necesita, entre otros, el webhook que se manda al proveedor (ChatBusinessService.SendWebhook).
                user = Common.Utility.Helper.DeserializeObject<User>(u.Usuario) ?? new User();
                user.UsuarioId = u.UsuarioId;
                user.Nombre = u.Nombre;
            }
            return user;
        }

        public string getExternalId(int userId, int providerId)
        {
            var c = Context.UsuarioProveedor.Where(x => x.UsuarioId == userId && x.ProveedorId == providerId).FirstOrDefault();
            return c?.UsuarioProveedorId;
        }

        internal void updateProviderData(string code, int provider, int userId)
        {
            var c = Context.UsuarioProveedor.Where(x => x.UsuarioId == userId && x.ProveedorId == provider).FirstOrDefault();
            if (c == null) { 
                var up = new UsuarioProveedor()
                {
                    UsuarioId = userId,
                    ProveedorId = provider,
                    UsuarioProveedorId = code
                };
                Context.UsuarioProveedor.Add(up);
            } else {
                c.UsuarioProveedorId = code;
                Context.UsuarioProveedor.AddOrUpdate(c);
            }
            SaveChanges();
            
        }

    }
}