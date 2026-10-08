using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Business.Dto.Dtos.Authentication;
using Business.Entities;
using Business.Entities.Security;
using Common.BusinessException;
using Newtonsoft.Json;

namespace WebFront.Controllers
{
    public class AuthenticationController : BaseController
    {

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Authentication()
        {
            //Quien ya tiene la cookie de login no tiene nada que hacer aca: entra por un acceso directo o un link viejo
            //a /login y tiene que caer en sus chats, no volver a pedir un SMS.
            if (Request.IsAuthenticated)
                return RedirectToRoute("chats");

            return View("Authentication");
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult NotLoggin()
        {
            return View();
        }

        //Los tres pasos del login por telefono. Devuelven JSON porque los llama la pantalla por ajax
        //(Scripts/Factorys/FactoryAuthentication.js) y los errores son mensajes para mostrarle al usuario:
        //el codigo no coincide, vencio, se acabaron los intentos. Por eso no se dejan explotar.
        [HttpPost]
        [AllowAnonymous]
        public ActionResult RequestCode(RequestCodeDto request)
        {
            try
            {
                middlewareChatMeService.authentication.requestCode(request);
                return Json(new { ok = true });
            }
            catch (APIException ex)
            {
                return Json(new { ok = false, error = ex.getErrorMessage() });
            }
            catch (Exception)
            {
                return Json(new { ok = false, error = "No pudimos enviarte el código. Probá de nuevo." });
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult VerifyCode(VerifyCodeDto request)
        {
            try
            {
                var result = middlewareChatMeService.authentication.verifyCode(request);

                //Si todavia falta completar el perfil no hay sesion que guardar: la pantalla pide nombre y mail y
                //vuelve por CompleteProfile con el mismo codigo.
                if (!result.NeedsProfile)
                    CreateState(result.Session);

                return Json(new { ok = true, needsProfile = result.NeedsProfile, name = result.Usuario?.Nombre, mail = result.Usuario?.Mail });
            }
            catch (APIException ex)
            {
                return Json(new { ok = false, error = ex.getErrorMessage() });
            }
            catch (Exception)
            {
                return Json(new { ok = false, error = "No pudimos validar el código. Probá de nuevo." });
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult CompleteProfile(CompleteProfileDto request)
        {
            try
            {
                var result = middlewareChatMeService.authentication.completeProfile(request);
                CreateState(result.Session);

                return Json(new { ok = true });
            }
            catch (APIException ex)
            {
                return Json(new { ok = false, error = ex.getErrorMessage() });
            }
            catch (Exception)
            {
                return Json(new { ok = false, error = "No pudimos guardar tus datos. Probá de nuevo." });
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Go(string t)
        {
            AuthenticationDto payload;
            try
            {
                var json = Common.Utility.Helper.DecodeBase64String(t);
                payload = JsonConvert.DeserializeObject<AuthenticationDto>(json);

                //validar auth
                


                //validar la vigencia del link? -> puede ser solo por el chat..
                //if (DateTimeOffset.FromUnixTimeSeconds(payload.exp).UtcDateTime < DateTime.UtcNow)
                //    return RedirectToRoute("NotLoggin");
                

                var session = middlewareChatMeService.authentication.loggin(payload);
                CreateState(session);

                var business = middlewareChatMeService.shop.get(payload.businessId);
                if (business != null)
                {
                    Chat c = new Chat()
                    {
                        DateInit = DateTime.UtcNow,
                        Shop = business,
                        User = session.Usuario,
                        Messages = payload.history.Select(h => new Message()
                        {
                            Date = DateTime.UtcNow,
                            From = new FromMessage()
                            {
                                From = h.from.type.ToUpper() == "USER" ? MensajeEnviadoPor.Usuario : MensajeEnviadoPor.Negocio,
                                Name = h.from.name,
                                Picture = h.from.pictureUrl
                            },
                            State = MensajeEstado.Recibido,
                            externalId = h.GetExternalId(payload.provider.ToString()),
                            Detail = new MessageDetail()
                            {
                                Text = h.message.Text,
                                Image = string.IsNullOrEmpty(h.message.Image) ? null : Common.Utility.Imagenes.Imagenes.resizeImage(Common.Utility.Helper.ConseguirArchivoDesdeUrlWeb(h.message.Image)),
                                Audio = string.IsNullOrEmpty(h.message.Audio) ? null : Common.Utility.Archivos.Archivos.UploadAsync(h.message.Audio, Common.Utility.Helper.GetFileNameFromUrl(h.message.Audio)).GetAwaiter().GetResult(), // Common.Utility.Archivos.Archivos.UploadAsync(request.Content, request.FileName, "chat", request.ContentType).GetAwaiter().GetResult();
                                File = string.IsNullOrEmpty(h.message.File) ? null : Common.Utility.Archivos.Archivos.UploadAsync(h.message.File, Common.Utility.Helper.GetFileNameFromUrl(h.message.File)).GetAwaiter().GetResult(), //h.message.File,
                                Video = string.IsNullOrEmpty(h.message.Video) ? null : Common.Utility.Archivos.Archivos.UploadAsync(h.message.Video, Common.Utility.Helper.GetFileNameFromUrl(h.message.Video)).GetAwaiter().GetResult(),
                                Sticket = h.message.Sticket,
                                Buttons = h.message.Buttons?.Select(b => new ButtonMessageDetailt()
                                {
                                    Text = b.Text,
                                    Payload = b.Payload
                                }).ToList()
                            }
                        }).ToList()
                    };

                    var chat = middlewareChatMeService.chat.Create(c);

                    //Mismo esquema que usa el front al hacer click en un chat (Scripts/Models/Chat/Chat.js, OpenChat):
                    //base64 + url-encode. La ruta #chat/:id de Sammy (Scripts/Sammy/Main.Sammy.js) lo toma al llegar
                    //a /chats y abre esta conversacion directo, sin que el usuario tenga que buscarla en la lista.
                    if (chat != null && chat.Id > 0)
                    {
                        var encodedChatId = Uri.EscapeDataString(Common.Utility.Helper.Base64Encode(chat.Id.ToString()));
                        return Redirect("/chats#chat/" + encodedChatId);
                    }
                }
            }

            catch {
                return RedirectToRoute("NotLoggin");
            }

            return RedirectToRoute("Chats");

        }


        public ActionResult Loggin(string token)
        {
            try
            {
                var session = new Business.Entities.Security.Session();
                CreateState(session);
               

                return View();
            }
            catch (Exception)
            {
                return View("Authentication/NotLoggin");
            }
            
        }

        private void CreateState(Session sessionData) {

            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(
                              1,
                              string.Empty,
                              DateTime.Now, // Date/time de creacion
                              DateTime.Now.AddDays(30.0), // Date/time de expiracion
                              true, // "true" para persistencia de cookie
                              Common.Utility.Helper.Base64Encode(Common.Utility.Helper.SerializeObjectSimple(sessionData)),  // Los roles, el perfil
                              FormsAuthentication.FormsCookiePath);// Path de la cookie

            string hash = FormsAuthentication.Encrypt(ticket);

            //Sin Expires la cookie es de sesion del navegador y se borra al cerrarlo (en el celular, cada vez que el
            //sistema cierra la app), aunque el ticket diga 30 dias.
            HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, hash)
            {
                HttpOnly = true, // cookie not available in javascript.
                Expires = ticket.Expiration
            };

            Response.Cookies.Add(cookie);

        }


       

    

    }
}