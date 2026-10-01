using System.Data.Entity;
using System.Linq;
using Business.Entities;
using Business.Entities.Security;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;
using Common.Utility.Extensions;
using System;
using Business.Dto.Dtos.Apis;
using System.Data.Entity.Migrations;
namespace ChatbotDesarrollo.Core.Manager
{
    public sealed class ShopManager : EntityManager<Negocios, Chatbot_DesarrolloEntities>
    {

        internal Shop search(string param)
        {
            param = param.Remove("-").Remove("+").RemoveSpace();
            Shop shop = null;
            var s = Context.Negocios.Include(x => x.SubRubros.Rubros)
                                    .Where(x => x.Nombre.Contains(param) ||
                                                x.Telefono == param).FirstOrDefault();

            if (s != null) {
                shop = Common.Utility.Helper.DeserializeObject<Shop>(s.Negocio);
                shop.Id = s.NegocioId;
                shop.SubRubro = ToSubRubro(s.SubRubros);
            }

            return shop;
        }

        internal Shop get(int id)
        {
            
            Shop shop = null;
            //Include explicito: el getter de Context (Framework.Core.EntityManager) apaga lazy loading y proxies, asi
            //que sin esto s.Proveedores siempre viene en null, aunque el negocio tenga ProveedorId cargado.
            var s = Context.Negocios.Include(x => x.Proveedores)
                                    .Include(x => x.SubRubros.Rubros)
                                    .Where(x => x.NegocioId == id).FirstOrDefault();
            if (s != null)
            {
                //Igual que en ChatManager.GetLote: las columnas mandan sobre el JSON de Negocios.Negocio, que puede
                //estar vacio o desactualizado. Sin esto el negocio venia sin nombre por este camino (GetChat).
                shop = Common.Utility.Helper.DeserializeObject<Shop>(s.Negocio) ?? new Shop();
                shop.Id = s.NegocioId;
                shop.Nombre = s.Nombre;
                shop.SubRubro = ToSubRubro(s.SubRubros);

                if (s.Proveedores != null)
                {
                    shop.Provider = Common.Utility.Helper.DeserializeObject<Provider>(s.Proveedores.Proveedor);
                }

            }

            return shop;
        }

        //El rubro se arma desde las tablas, no desde el JSON de Negocios.Negocio: el negocio apunta al subrubro y el
        //icono esta un nivel mas arriba, en el rubro. Lo usa tambien ChatManager.GetLote, que tiene el Negocios en mano
        //y no pasa por get(), asi que el mapeo vive aca una sola vez.
        internal static SubRubro ToSubRubro(SubRubros subRubro)
        {
            if (subRubro == null)
                return null;

            return new SubRubro()
            {
                Id = subRubro.SubRubroId,
                Nombre = subRubro.Nombre,
                Rubro = subRubro.Rubros == null ? null : new Rubro()
                {
                    Id = subRubro.Rubros.RubroId,
                    Nombre = subRubro.Rubros.Nombre,
                    Icono = subRubro.Rubros.Icono
                }
            };
        }

        //El token dejo de colgar del proveedor y ahora cuelga del negocio: la tabla ProveedoresTokens se elimino y la
        //reemplaza NegocioAuthentication, con la misma forma pero apuntando a Negocios. El Code de la tabla es lo que
        //antes era TokenId. De paso esto acomoda a Authentication.shopId, que ahora si lleva un NegocioId.
        internal Authentication token(string code, string secret, string tokenProveedor)
        {
            var auth = Context.NegocioAuthentication.Include(x => x.Negocios)
                              .Where(x => x.SecretId == secret && x.Code == code && x.FechaVencimiento >= DateTime.UtcNow)
                              .FirstOrDefault();

            var proveedor = Context.Proveedores.Where(x => x.Code == tokenProveedor).FirstOrDefault();


            Authentication r = null;
            if (auth != null && proveedor != null) {

                var s = Context.Negocios.Where(x => x.NegocioId == auth.Negocios.NegocioId).FirstOrDefault();
                s.Proveedores = proveedor;
                Context.Negocios.AddOrUpdate(s);
                SaveChanges();

                r = new Authentication()
                {
                    code = auth.Authentication,
                    shopId = auth.Negocios.NegocioId,
                    expire = auth.FechaVencimiento,
                    tokenId = auth.Code
                };


               

            }
            return r;
        }


    }
}