using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Framework.Core.Connection
{
    public class ConnectionStringSeguridadManager
    {
        public static string BuildConnectionStringQstomSeguridad()
        {
            return ConfigurationManager.ConnectionStrings["QstomClientDataContext"].ConnectionString;
            //string csClient = string.Empty;

            //if (ClientId != "0")
            //{
            //    // Build the connection string from the provided datasource and database

            //    var scSeguridad = ConfigurationManager.ConnectionStrings["QstomSeguridadDataContext"].ConnectionString;
            //     csClient = ConfigurationManager.ConnectionStrings["QstomClientDataContext"].ConnectionString;
                
            //}
            //else
            //{
            //    csClient = ConfigurationManager.ConnectionStrings["QstomSeguridadDataContext"].ConnectionString;

            //}
            //return csClient;

        }
    }
}
