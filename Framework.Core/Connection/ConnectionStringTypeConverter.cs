


using System.ComponentModel;
using System.Configuration;
using System.Globalization;
using System.Threading;

namespace Framework.Core.Connection
{
    public sealed class ConnectionStringTypeConverter : TypeConverter
    {
        /// <summary>
        /// ConvertFrom
        /// </summary>
        /// <param name="context"></param>
        /// <param name="culture"></param>
        /// <param name="value"></param>
        /// <returns>connection</returns>
        public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
        {

            var customIdentity = Thread.CurrentPrincipal as Common.Services.Interceptor.GenericPrincipal;
            if (customIdentity != null)
            {
                var custom = (Common.Services.Interceptor.CustomIdentity)customIdentity.Identity;
                var cs = ConnectionStringSeguridadManager.BuildConnectionStringQstomSeguridad();
                return ConnectionStringManager.BuildConnectionStringChatbotDesarrollo(cs);

                //return ConnectionStringSeguridadManager.BuildConnectionStringQstomSeguridad();

                //var encryptDataSource = ConnectionStringSeguridadManager.BuildConnectionStringQstomSeguridad(custom.Family);
                //if (string.IsNullOrEmpty(encryptDataSource))
                //{
                //    throw new System.Exception("El cliente " + custom.Family + " no es válido");
                //}
                //return encryptDataSource;
                //var connection = custom.Family != "0" ? ConnectionStringManager.BuildConnectionStringChatbotDesarrollo(encryptDataSource) : encryptDataSource;
                //return connection;

            }
            else
            {
                return ConfigurationManager.ConnectionStrings["QstomMasterDataContext"].ConnectionString; ;

            }

        }
    }
}