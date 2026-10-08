using System.Linq;
using Business.Entities;
using Framework.Core.Entity;
using ModelChatbotDesarrollo.Core;

namespace ChatbotDesarrollo.Core.Manager
{
    public sealed class ProviderManager : EntityManager<Proveedores, Chatbot_DesarrolloEntities>
    {
        //Busca por la columna Code, que es el token del proveedor (el mismo tokenProveedor de ShopManager.token), no por
        //el Code que viene adentro del JSON. El Id sale de la columna: el JSON de Proveedores.Proveedor puede no tenerlo
        //o tenerlo desactualizado, igual que pasa con Negocios.Negocio en ShopManager.get.
        internal Provider getByCode(string code)
        {
            var p = Context.Proveedores.Where(x => x.Code == code).FirstOrDefault();
            if (p == null)
                return null;

            var provider = Common.Utility.Helper.DeserializeObject<Provider>(p.Proveedor) ?? new Provider();
            provider.Id = p.ProveedorId;

            return provider;
        }
    }
}
