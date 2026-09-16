using System.Net;

namespace Common.CallApi
{
    public sealed class MethodParameters
    {
        /// <summary>
        /// Action name to call
        /// </summary>
        public string Action;

        /// <summary>
        /// Controller name to call
        /// </summary>
        public string Controller;

        /// <summary>
        /// Objecto with attribite to send
        /// </summary>
        public object Params;

        /// <summary>
        /// Use url encode, false use json encode, true use FormUrlEncodedContent
        /// </summary>
        public bool UseUrlEncode;

        /// <summary>
        /// Attache user and family parameters in header for request, anly use un Login method
        /// </summary>
        public AnonymousType Anonymous = AnonymousType.None;

        /// <summary>
        /// Catch internlas error in scope call method, and redirect to internla variable ResultState
        /// </summary>
        public bool CacthInternalExaption;
    }
}