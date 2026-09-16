using System.Collections.Generic;
using System.Linq;

namespace Common.Utility
{
    public static class Cache
    {

        //public static T getData<T>(System.Web.HttpSessionStateBase session, string dataKey, bool esPropioUsuario = false)
        //{

            
        //    string familiaId = Helper.GetSessionData(session)?.ClienteId;
        //    string usuarioId = Helper.GetSessionData(session)?.Usuario?.UsuarioId.ToString();

        //    string keySession = familiaId
        //                        + (esPropioUsuario ? "_" + usuarioId : string.Empty)
        //                        + "_" + dataKey;


        //    return (T)session[keySession];

        //}

        //public static void setData<T>(System.Web.HttpSessionStateBase session, string dataKey, T value, bool esPropioUsuario = false)
        //{

        //    string familiaId = Helper.GetSessionData(session)?.ClienteId;
        //    string usuarioId = Helper.GetSessionData(session)?.Usuario?.UsuarioId.ToString();


        //    if (!string.IsNullOrEmpty(familiaId) && !string.IsNullOrEmpty(usuarioId))
        //    {
        //        string keySession = familiaId
        //                                        + (esPropioUsuario ? "_" + usuarioId : string.Empty)
        //                                        + "_" + dataKey;

        //        session[keySession] = value;
        //    }

        //}

        //public static void removeSession(System.Web.HttpSessionStateBase session, string dataKey, bool esPropioUsuario = false)
        //{
        //    string familiaId = Helper.GetSessionData(session)?.ClienteId;
        //    string usuarioId = Helper.GetSessionData(session)?.Usuario?.UsuarioId.ToString();

        //    if (!string.IsNullOrEmpty(familiaId) && !string.IsNullOrEmpty(usuarioId))
        //    {
        //        string keySession = familiaId
        //                        + (esPropioUsuario ? "_" + usuarioId : string.Empty)
        //                        + "_" + dataKey;

        //        session.Remove(keySession);
        //    }
        //}

        //public static void updateData<T>(System.Web.HttpSessionStateBase session, string dataKey, T value, string primaryKeyField, bool esPropioUsuario = false)
        //{
        //    //remove exist item from cache 
        //    try
        //    {
        //        removeValue(session, dataKey, value, primaryKeyField, esPropioUsuario);
        //    }
        //    catch
        //    { }

        //    //get all data
        //    IEnumerable<T> dataCache = getData<IEnumerable<T>>(session, dataKey, esPropioUsuario);
        //    if (dataCache != null)
        //    {
        //        //add new item
        //        List<T> newDataCache = dataCache.ToList();
        //        newDataCache.Add(value);
        //        setData<IEnumerable<T>>(session, dataKey, (IEnumerable<T>)newDataCache, esPropioUsuario);
        //    }
        //}

        //public static void removeValue<T>(System.Web.HttpSessionStateBase session, string dataKey, T value, string primaryKeyField, bool esPropioUsuario = false)
        //{
        //    IEnumerable<T> valores = getData<IEnumerable<T>>(session, dataKey, esPropioUsuario);
        //    if (valores != null)
        //    {
        //        List<T> valoresLista = valores.ToList();
        //        var newValues = (valoresLista).Where(x => !x.GetType().GetProperty(primaryKeyField).GetValue(x, null).Equals(value.GetType().GetProperty(primaryKeyField).GetValue(value, null)));

        //        setData<IEnumerable<T>>(session, dataKey, (IEnumerable<T>)newValues, esPropioUsuario);
        //    }
        //}


        //public static string getUserConfig(System.Web.HttpSessionStateBase session)
        //{
        //    var a = getData<string>(session, "UserData", true);

        //    return a;
        //}

        //public static void setUserConfig(System.Web.HttpSessionStateBase session, string configuracion)
        //{
        //    removeSession(session, "UserData");
        //    setData<string>(session, "UserData", configuracion, true);
        //}

    }
}
