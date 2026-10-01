# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`ProjectChatMe` (solution `ProjectChatMe.sln`) is a **new Botiseller module**: a lightweight chat inbox where an end
user (identified by phone) opens a link coming from a business's chatbot, gets an anonymous-ish session, and browses
their conversations with businesses. It sits as a 9th sibling folder inside the `C:\Botiseller Solution` workspace
described by the parent `..\CLAUDE.md`, but it is **not** one of the 8 modules listed there. Read the parent file for
platform-wide conventions (Spanish domain vocabulary, layered Business/Core/Middelware pattern, the `Middelware`
spelling), then apply the differences below, which override it for this repo.

Two things to know before editing anything:

1. **It was cloned from `ModuleCampaign` and emptied out.** `README.md` still says `# Botiseller-Campaign`. The
   campaign code was deleted; what remains is the plumbing plus the Chat / Shop / User / Security features.
2. **It is fully self-contained.** Unlike every other module in the workspace, no `.csproj` here references
   `..\Botiseller-CRM\...`. This repo vendors its own copies of `Business.Dto`, `ModelChatbotDesarrollo.Core`,
   `ChatbotDesarrollo.Core`, `Framework.*` and `Common.*`. Every `<ProjectReference>` is a sibling `..\Project\`
   inside this folder. A change here affects nothing outside this repo, and changes in `Botiseller-CRM` do not
   propagate in. Do not "fix" this by re-pointing references at `Botiseller-CRM`.

The vendored copies are *trimmed*, not identical to the CRM originals — e.g. `Common.CallApi`'s `HttpClientWrapper`
adds `CreateApiChatMe()`, and `Common.Services.Interceptor` contains only `CustomIdentity` + `GenericPrincipal` (no
actual AOP interceptor). Don't assume a helper exists here because it exists in another module; grep this repo first.

## Build and run

.NET Framework 4.8, old-style `.csproj` + `packages.config`. There is no `dotnet build`, no CI config, and **no
tests at all** — verify changes by reading call sites and running the two web projects. Neither `msbuild`, `nuget`
nor `git` is on PATH in the PowerShell environment; use the full MSBuild path:

```powershell
$msbuild = "C:\Program Files\Microsoft Visual Studio\18\Insiders\MSBuild\Current\Bin\MSBuild.exe"

# restore packages (packages.config style) then build
& $msbuild "ProjectChatMe.sln" /t:Restore /p:RestorePackagesConfig=true
& $msbuild "ProjectChatMe.sln" /p:Configuration=Debug

# single project
& $msbuild "WebApiMiddelware\WebApiMiddelware.csproj" /p:Configuration=Debug
```

Solution configurations are `Debug`, `Release`, `EventsDev`, `EventsTest`. Only `WebApiMiddelware` has distinct
`EventsDev`/`EventsTest` build configs; every other project maps those to `Debug`.

`ProjectChatMe.slnLaunch.user` starts **both** `WebApiMiddelware` and `WebFront`, which is what you normally want —
the front is useless without its middleware. Ports come from each `.csproj`'s `<IISUrl>`:

| Project | URL |
|---|---|
| `WebApiMiddelware` | `http://localhost:61110` |
| `WebFront` | `http://localhost:61100` (https 44355) |

`WebFront\Web.config` key `WebApiUrlChatMe` (= `http://localhost:61110`) is what ties them together. If you change
the API port, change it there. `WebApiMiddelware\Web.config` also has a `WebApiUrlChat` (`47310`) — unused leftover.

## Architecture

Two IIS hosts, one shared class-library stack:

```
Browser (Knockout JS)
  -> WebFront (MVC 5)  controller   : BaseController holds a MiddlewareChatMeService
    -> Business.CallAPI.Services.MiddlewareChatMeService     (one nested *Call class per API controller)
      -> Common.CallApi.HttpClientWrapper  GET/POST {WebApiUrlChatMe}/{Controller}/{Action}
        -> WebApiMiddelware (Web API 2)  controller : MidlewareBaseController
          -> Business\Service\XxxBusinessService : IXxxBusinessService     (contracts in Business.Contracts)
            -> ChatbotDesarrollo.Core.Facade.ChatbotDesarrolloServicesFacade   (Unity resolve, per call)
              -> Services\XxxServices -> Logic\XxxLogic -> Manager\XxxManager -> EF context
```

Features currently implemented end to end: `Security/Loggin`, `User/Search|Create`, `Shop/Search`,
`Chat/Create|GetLote`. Domain DTOs (`Chat`, `Message`, `MessageDetail`, `Shop`, `User`, `Session`) live in
`Business.Entities` and are used directly as request/response bodies; `Business.Dto` only holds `AuthenticationDto`
(`name`, `phone`, `provider`, `businessPhone`, `history[]`) and enums.

### Adding a feature — touch these places

1. `Business.Entities` — model (if new).
2. `Business.Contracts\Service\IXxxBusinessService.cs` and `Business\Service\XxxBusinessService.cs`.
3. `ChatbotDesarrollo.Core` — `Services\XxxServices`, `Logic\XxxLogic`, `Manager\XxxManager`, plus a property in
   `Facade\ChatbotDesarrolloServicesFacade`. The EF query lives only in the Manager; Services/Logic are passthroughs.
4. `WebApiMiddelware\Unity.config` — add an `<alias>` **and** a `<register>` for each new `*Services` class.
   Forgetting this is the usual failure: the Facade throws at resolve time.
5. `Business\RegisterModules.cs` — register `XxxBusinessService` as `IXxxBusinessService` (Autofac). See caveat below.
6. `WebApiMiddelware\Controllers\XxxController.cs` deriving from `MidlewareBaseController`, with
   **`[Route("Controller/Action")]` on every action** — `WebApiConfig.Register` only calls `MapHttpAttributeRoutes()`,
   there is no default route.
7. `Business.CallAPI\Services\MiddlewareChatMeService.cs` — add/extend a nested `XxxCall` class; its
   `Controller`/`Action` strings must match the route from step 6 (`BuildUrl` → `{url}/{Controller}/{Action}`).
   `Call<T>` = GET (params become query string), `CallPost<T>` = POST JSON body.
8. `WebFront\Controllers\XxxController.cs` (extends `BaseController`) plus a route in `WebFront\App_Start\RouteConfig`
   (routes are explicit, one per action).
9. Front JS under `WebFront\Scripts\`: `Factorys\FactoryXxx.js` ($.ajax to the MVC route) → `Entities\Xxx.js`
   (`XxxClass`) → `Models\Xxx\Xxx.js` (Knockout ViewModel bound in the view). `Views\_BaseLayout.cshtml`-based views
   load their script with `Scripts.Render("~/Scripts" + Helper.getVersionScript() + "/Models/.../X.js")`
   (`version` app setting is empty by default).

### Code style the owner expects

These are corrections the owner has made to generated code. They override generic "clean code" instincts — follow
them even when the usual advice says otherwise.

- **Do not extract one-off private helpers.** A mapping, a ternary or a short expression used in a single place goes
  inline, even if the containing method grows. `BuildButtons`, `BuildFrom`, `ToWebhookButton` and `Post` were all
  written as private methods and all removed on review: *"saqué funciones internas que no me gustan que estén porque
  no se van a implementar en otro lado. Me ensucia el código y se hace menos legible, si necesito saber de una función
  la leo."* A private method is only justified when it names a distinct **step of the flow** — `SendWebhook`,
  `NotifyUser`, `CurrentUserName` survived; pure plumbing did not.
- **Do not invent validations or rules that were not asked for.** An added `throw` for a case nobody mentioned gets
  deleted.
- **Prefer the plain shape over the defensive one.** `MensajeEnviadoPorDto From` was chosen over a nullable
  `MensajeEnviadoPorDto?` with a documented default.
- Code comments are in Spanish, without accents, and explain **why**, not what.

### Layering rules (enforced by the owner, not just convention)

- **Business rules go in `Business\Service\*BusinessService`, never in a Manager.** The Manager only reads and writes
  data; the only checks that belong there are data-level — the row exists, it belongs to the session user.
- **The Manager receives objects already built and validated.** Deciding who sends a message, its state and its date
  are business decisions: `ChatManager.SendMessage` takes a finished `Message` and only persists it.
- **Managers do not call other Managers.** Go through the business layer (`UserBusinessService` → Facade →
  `UserServices` → Logic → Manager) instead of `new UserManager()` from inside another Manager.
- **Nothing the caller should declare is assumed in the business.** Who sends a message travels in
  `SendMessageDto.From`; the business maps it rather than hardcoding `MensajeEnviadoPor.Usuario`.
- **`Business.Dto` does not reference `Business.Entities`.** When a DTO needs a type that already exists as an
  entity, mirror it in `Business.Dto` (`SendMessageButtonDto`, `MensajeEnviadoPorDto`) and map in the business layer.
  Mirrored enums **must keep the same numeric values**: they end up in DB columns (`Mensajes.Origen`).
- **A contract shared by two sides lives in exactly one place.** Channel and function names
  (`Common.Websocket.Canales`/`Funciones` ↔ `WebsocketClass.Funciones`) and the public message id format
  (`Business.Entities.MessageIdExterno`, `CMID-{id}`) are shared constants because a mismatch produces **no error** —
  the message is sent to a channel nobody listens to, or an id nobody can correlate.

### Real time (SignalR)

`Common.Websocket` (SignalR 2.4.3) hosts `ChatHub`, mapped at `/signalr` in `WebApiMiddelware\Startup.cs` with CORS,
because that is the host where `ChatBusinessService` runs and the push is in-process. The browser (another port)
connects from `Scripts\Site\Websocket.Site.js`, loaded by `_BaseLayout.cshtml` so the connection exists on **every**
screen, not only the chat; `Models\Chat\Chat.js` subscribes to that same connection instead of opening its own.

- The hub resolves the user **server side**, from the `clientCode` query string (the same base64 `Session` that
  travels as `X-ClientCode`), and ignores anything the client claims. Never let the client pick its own channel.
- Register every callback **before** `Conectar()`: SignalR decides which hubs to subscribe to from what is registered
  at `start()` time. Registering after connecting silently receives nothing.
- `WebsocketClass.On` keeps a list of subscribers per name and installs one dispatcher, because
  `$.connection.chatHub.client[name]` holds a single function and a second assignment would overwrite the first.

### Two DI mechanisms, and what actually uses them

- **Autofac** (`WebApiConfig.Register`) is used only to build API controllers and inject a per-request `IInternalHeader`
  built from the `X-ClientCode`, `X-SourceSystem`, `Authorization`, `X-SessionId`, `X-RequestId` headers.
  `RegisterModules.cs` is **not** loaded by `WebApiConfig` (only `RegisterApiControllers`, `HttpContextBase`,
  `IInternalHeader` are registered), and the API controllers instantiate their business service with `new`
  (`_service = new ChatBusinessService()`). So step 5 is effectively documentation today; `Business\Models\Connection`
  + `ConnectionValidator` (FluentValidation) are likewise unused. `WebApiMiddelware\Service\Services.cs`
  (`Services<TBusiness>`) is dead code. Follow the existing `new XxxBusinessService()` pattern unless you are also
  wiring `RegisterModules` into the container.
- **Unity** (`Unity.config`, `Framework.Core\Unity`) resolves the Core layer. `UnityFactoryClass.Resolve<T>()` builds a
  **new container on every call**, and `IEntityContextManager` is mapped to `EntityContextManagerChatbotDesarrollo`
  with `connectionString` produced by `ConnectionStringTypeConverter` at resolve time — i.e. the tenant/connection is
  decided from `Thread.CurrentPrincipal` at the moment the Facade property is read.
- Core generic bases live in `Framework.Core\Entity`: `EntityServices<TEntity,TManager,TLogic,TContext>` exposes
  `DefaultLogic`, `EntityLogic<...>` exposes `DefaultManager`, `EntityManager<TEntity,TContext>` exposes `Context`,
  `SaveChanges()` and CRUD/FTP/GeoIP helpers. Follow `ChatServices`/`ChatLogic`/`ChatManager`.

### Identity / session flow (the part that spans the most files)

1. A business's chatbot sends the user to `WebFront /go?t=<base64 of AuthenticationDto JSON>`
   (`AuthenticationController.Go`).
2. `Go` calls `Security/Loggin` on the API (`AnonymousType.WithoutCredential`, so `HttpClientWrapper` first sets a
   `CustomIdentity` from the params' `name`/`phone`). `SecurityBusinessService.Loggin` finds the user by phone, creates
   it if missing, and returns a `Session` (`Init`, `From`, `Usuario`). No token is issued (`TokenId` unused).
3. `Go` then `Shop/Search`es `businessPhone` and, if found, `Chat/Create`s a chat seeded with `payload.history`.
   Any exception in this block redirects to the `NotLoggin` route.
4. `CreateState` stores the `Session` in ASP.NET `Session["SessionData"]` **and** in a 30-day FormsAuthentication
   cookie whose `UserData` is `base64(JSON(Session))`.
5. On every later front request, `MvcApplication.Application_AuthenticateRequest` decrypts the cookie, rebuilds a
   `CustomIdentity { session }` wrapped in `Common.Services.Interceptor.GenericPrincipal` and assigns
   `Thread.CurrentPrincipal`.
6. `Common.CallApi\HttpClientMessageHandnler` copies that principal into the outgoing `X-ClientCode` header.
7. API side: `MidlewareBaseController`'s constructor → `InternalHeaderFactory.CreateEnvironmentThread` base64-decodes
   the header, deserializes it as `Session` and re-creates `Thread.CurrentPrincipal`. **Every API controller must
   derive from `MidlewareBaseController`**, and a request without a decodable `X-ClientCode` fails before the action.
8. Managers read the current user through `Common.Utility.Helper.GetUserBySession()`
   (`CustomIdentity.session.Usuario.UsuarioId`) — `ChatManager.GetLote` does, so chat lists are scoped by it.

Things to verify before relying on this path (read from code, not run): the `CustomIdentity` branch of
`HttpClientMessageHandnler` serializes the *identity* (`{"session":{...},"Name":...}`) while step 7 deserializes the
header as a bare `Session`, and the `FormsIdentity` branch sends `UserData` (a bare `Session`) — the two shapes differ;
and `Helper.DeserializeObject` uses `TypeNameHandling.All` on a client-supplied header. Also `GetUserBySession`
swallows exceptions and then `int.Parse("")` throws a `FormatException` when no user is on the principal. Most front
actions are `[AllowAnonymous]` and there is no server-side authorization check.

### Connection string / tenant resolution

`ConnectionStringSeguridadManager.BuildConnectionStringQstomSeguridad` is a **stub**: the CRM's per-tenant lookup is
commented out, so it always returns the `QstomClientDataContext` connection string from `WebApiMiddelware\Web.config`,
and `BuildConnectionStringChatbotDesarrollo` wraps it in an EF `EntityConnectionStringBuilder` (the TripleDES decrypt
code is commented out too). `ConnectionStringTypeConverter` only takes that path when `Thread.CurrentPrincipal` is a
`GenericPrincipal`; otherwise it falls back to a `QstomMasterDataContext` string that **is not defined in any
`Web.config`**. Consequence: any Facade call made before the principal is set (or outside a request that went through
`MidlewareBaseController`) will fail. `Family`/`State`/`Environment` app settings in the API `Web.config` are not read
by this code path today.

## Data model

Entity Framework 6 **Database First**, `ModelChatbotDesarrollo.Core\ModelChatbotDesarrollo.edmx`, DbContext
`Chatbot_DesarrolloEntities`, DB `ChatMeDB`. Tables: `Chats`, `Mensajes`, `Negocios`, `Rubros`, `SubRubros`,
`Usuarios` (plus a few stored-proc/function result types inherited from the CRM whose procs may not exist in
`ChatMeDB`). Mapping conventions worth knowing:

- `Chats` ↔ `Chat` is keyed by (`NegocioId`, `UsuarioId`): `ChatManager.Create` appends to the existing chat if there
  is one, otherwise creates it. `Chats.UltimoMensaje` caches the latest message as JSON.
- `Mensajes.Mensaje` and `Negocios.Negocio` are **JSON blobs** (a serialized `Message` / `Shop`) with `Estado`/`Origen`
  stored as ints of `MensajeEstado`/`MensajeEnviadoPor`. Managers (de)serialize with `Common.Utility.Helper`.
- `GetLote(lote)` pages 20 chats per lote, newest first.

Grow the model by updating the EDMX from the database in Visual Studio (the `.tt` templates regenerate POCOs). Unlike
`Botiseller-CRM`, this repo has **no `Base de datos\Releases\` folder**, so there is nowhere here to put a migration
script; decide with the team where `ChatMeDB` schema scripts live before adding tables. The EF connection string
named `Chatbot_DesarrolloEntities` exists only in `ModelChatbotDesarrollo.Core\App.Config` (not loaded at runtime); the
runtime strings are `QstomSeguridadDataContext` / `QstomClientDataContext` / `MG2ControlDataContext` in the API's
`Web.config`.

`Web.config` in both hosts is committed with live shared-dev credentials and FTP secrets — assume any config edit you
make is going into git history.

### EDMX traps (hit three times already)

- **"Update Model from Database" only half-removes a dropped table.** It drops it from the SSDL and the MSL but
  leaves the `EntityType`, the `EntitySet`, its associations and the navigation properties in the **CSDL**. The result
  is `error 3027` at metadata load, which breaks **every query in the app**, not just that table's. This happened with
  `Aplicaciones`, `FK_Negocios_Rubros` and `ProveedoresTokens`. After dropping a table, delete the entity in the
  designer or clean the CSDL by hand.
- **A changed column type is not propagated either.** The SSDL updates, the CSDL keeps the old type, and the mapping
  fails with `error 2019` (`UsuarioProveedorId` was `varchar` in the DB and `Int32` in the CSDL). Same blast radius.
- **The `.tt` templates only run inside Visual Studio.** After editing the EDMX from outside, the POCOs in
  `ModelChatbotDesarrollo.Core` must be updated by hand (`Mensajes.FechaLeido` was one).
- The symptom is always the same and always misleading: *every* query fails, so the table that was touched is rarely
  the one that looks broken. Load the metadata before blaming the query.

## Verifying changes (there are no tests)

- Build with the full MSBuild path, then exercise the real HTTP flow. The API accepts a hand-made session:
  `X-ClientCode` is just `Base64(JSON(Session))`, so `Invoke-WebRequest` with that header reaches any endpoint.
- The EF model can be validated offline: load `EntityFramework.dll` + `ModelChatbotDesarrollo.Core.dll`, build an
  `EntityConnection` with `res://*/` metadata and force `GetItemCollection(CSSpace)`. That surfaces mapping errors
  (3027/2019) without running the app, and Entity SQL over it proves a navigation actually resolves.
- **Stale JavaScript is the most common false bug report.** `compilation debug="true"` means no bundling and no `?v=`
  cache busting, and `/chats` is a hash-routed SPA — moving between chats never re-fetches scripts. Hard-reload
  (Ctrl+Shift+R) before believing the front is broken.
- When a hand-written test harness disagrees with the code, suspect the harness: a raw SignalR long-polling client
  failed twice because it did not echo the `groupsToken`, and audio never loaded because the automation tab reports
  `visibilityState: "hidden"` and Chrome does not fetch media there.

## Scaffolding scars — expect these, don't chase them

- `DeliveryMailBusiness\`, `DeliveryMailService\`, `DeliveryServiceManual\` — leftover directories from
  `ModuleCampaign` containing only stale `.vs\*.dtbcache.json`; no `.csproj`, not in the solution.
- `WebFront\Src\` is a vendored SmartAdmin theme (hundreds of `.hbs` templates); `WebFront\Js\` is vendored
  third-party libraries (knockout, moment, datatables, jqvmap, ...). Neither is application code — exclude both from
  searches. Application JS is only in `WebFront\Scripts\`.
- `WebFront\BotAdmin.csproj.user` — orphan from the project's earlier name. `NewsController` (and the `Feed`
  equivalent) just returns a view; there is no backing API call for either.
- `Business.CallAPI\protos\` — Google API common-protos tree, unreferenced by any code.
- `Business.Contracts\Service\INegocioBusinessService.cs` has no implementation; `Business\Service\BaseService` is
  empty. `Business.CallAPI\Services\MiddelwareBaseService` is a static raw-`HttpWebRequest` helper (`CalltoApi*`,
  with Gemini-response normalization) carried over from the CRM; `MiddlewareChatMeService` does **not** derive from
  it — it goes through `Common.CallApi.HttpClientWrapper` instead.
- `Swashbuckle.Core` is in `packages.config` but nothing registers it — the API exposes no Swagger UI despite the
  parent CLAUDE.md saying modules do.
- `WebApiMiddelware\OAuthConfig.Register` is an empty method; `Startup.cs` calls it and nothing else.
- `RegisterModules.cs` calls `.EnableInterfaceInterceptors()` but no interceptor is attached — the AOP/logging aspect
  was stripped.
- `WebFront\App_Start\RouteConfig` has no catch-all: only `go`, `chats`, `news`, `feed`, `NotLoggin`, `Chats/GetLote`
  are mapped, and `MvcApplication.Application_Error` renders `ErrorController` views (NotFound/NotAutorized/Error)
  and logs through log4net.
- `WebFront` redirects to `/Authentication/Authentication` when an ASP.NET session is new but a session-id cookie
  already exists (`ValidateSessionState`); `Session.Timeout` is set to 525600 minutes.
