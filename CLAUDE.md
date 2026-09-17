# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`ProjectChatMe` (solution `ProjectChatMe.sln`) is a **new Botiseller module in scaffold state**. It sits as a 9th
sibling folder inside the `C:\Botiseller Solution` workspace described by the parent `..\CLAUDE.md`, but it is
**not** one of the 8 modules listed there — read the parent file for platform-wide conventions (Spanish domain
vocabulary, the layered Business/Core/Middelware pattern, the `Middelware` spelling), then apply the differences
below, which override it for this repo.

Two things to know before editing anything:

1. **It was cloned from `ModuleCampaign` and emptied out.** `README.md` still says `# Botiseller-Campaign`. All
   campaign-specific code was deleted, leaving the plumbing plus exactly one end-to-end demo feature.
2. **It is fully self-contained.** Unlike every other module in the workspace, no `.csproj` here references
   `..\Botiseller-CRM\...`. This repo vendors its own copies of `Business.Dto`, `ModelChatbotDesarrollo.Core`,
   `ChatbotDesarrollo.Core`, `Framework.*` and `Common.*`. Every `<ProjectReference>` is a sibling `..\Project\`
   inside this folder. A change here affects nothing outside this repo, and changes in `Botiseller-CRM` do not
   propagate in. Do not "fix" this by re-pointing references at `Botiseller-CRM`.

The vendored copies are also *trimmed*, not identical to the CRM originals — e.g. `Common.CallApi`'s
`HttpClientWrapper` exposes only `CreateApiChatMe()`, and `Common.Services.Interceptor` contains only
`CustomIdentity` + `GenericPrincipal` (no actual AOP interceptor). Don't assume a helper exists here because it
exists in another module; grep this repo first.

## Build and run

.NET Framework 4.8, old-style `.csproj` + `packages.config`. There is no `dotnet build`, no CI config, and **no
tests at all** (no test project, no MSTest scaffold) — verify changes by reading call sites and running the two
web projects.

Neither `msbuild` nor `nuget` is on PATH in this environment. Use the full path:

```powershell
$msbuild = "C:\Program Files\Microsoft Visual Studio\18\Insiders\MSBuild\Current\Bin\MSBuild.exe"

# restore packages (packages.config style) then build
& $msbuild "ProjectChatMe.sln" /t:Restore /p:RestorePackagesConfig=true
& $msbuild "ProjectChatMe.sln" /p:Configuration=Debug

# single project
& $msbuild "WebApiMiddelware\WebApiMiddelware.csproj" /p:Configuration=Debug
```

Solution configurations are `Debug`, `Release`, `EventsDev`, `EventsTest`. Only `WebApiMiddelware` actually has
distinct `EventsDev`/`EventsTest` build configs; every other project maps those to `Debug`.

Running: `ProjectChatMe.slnLaunch.user` starts **both** `WebApiMiddelware` and `WebFront` together, which is what
you normally want — the front is useless without its middleware. IIS Express bindings (`.vs\ProjectChatMe\config\applicationhost.config`):

| Project | URL |
|---|---|
| `WebApiMiddelware` | `http://localhost:44310` |
| `WebFront` | `http://localhost:44300` (https 44355) |

`WebFront\Web.config` sets `WebApiUrlChatMe` = `http://localhost:44310`, which is what ties them together. Note
`WebApiMiddelware\Web.config` also carries a `WebApiUrlChat` key pointing at `47310` — it is unused leftover; the
key this repo's client actually reads is `WebApiUrlChatMe`.

## The one reference feature — copy this slice

`Shared/ConseguirUniqueString` is implemented end to end and is the template for every new feature. Adding
anything means touching the same seven places, in this order:

```
WebFront\Views\... (AJAX)
  -> WebFront\Controllers\SharedController.cs          MVC controller, extends BaseController
    -> Business.CallAPI\Services\MiddlewareChatMeService.cs   Action/Controller pair
      -> Common.CallApi HttpClientWrapper.CreateApiChatMe()   GET {WebApiUrlChatMe}/{Controller}/{Action}
        -> WebApiMiddelware\Controllers\SharedController.cs   [Route("Shared/ConseguirUniqueString")]
          -> Business\Service\SharedBusinessService.cs        : ISharedBusinessService
            -> ChatbotDesarrollo.Core\Facade\ChatbotDesarrolloServicesFacade  (Unity resolve)
              -> Services\SharedServices -> Logic\SharedLogic -> Manager\SharedManager -> EF Context
```

Non-obvious constraints along that path:

- **Attribute routes are mandatory.** `WebApiConfig.Register` calls only `MapHttpAttributeRoutes()` — there is no
  default `api/{controller}/{id}` route. Every action needs `[Route("Controller/Action")]` spelled to match the
  `Controller`/`Action` strings in the `MiddlewareChatMeService` method, because `BuildUrl` produces
  `{_urlApi}/{Controller}/{Action}` (`Common.CallApi\HttpClientWrapper.cs:225`).
- **Two DI containers, both must be updated.** Autofac wires the API host (`Business\RegisterModules.cs`:
  register the `XxxBusinessService` as `IXxxBusinessService`); Unity wires the Core layer
  (`WebApiMiddelware\Unity.config`: add an `<alias>` **and** a `<register>` for each new `*Services` class, or
  `ChatbotDesarrolloServicesFacade` will throw at resolve time). Forgetting the Unity half is the usual failure.
- The Core layer's generic bases live in `Framework.Core\Entity`: `EntityServices<TEntity,TManager,TLogic,TContext>`
  exposes `DefaultLogic`, `EntityLogic<...>` exposes `DefaultManager`, `EntityManager<TEntity,TContext>` exposes
  `Context` plus the CRUD/FTP/GeoIP helpers. Follow `SharedServices`/`SharedLogic`/`SharedManager` — each layer is
  a thin passthrough and the actual EF query lives only in the Manager.
- Note the deliberate inconsistency in project naming: the shared-client project is `Business.CallAPI`
  (capital API) with namespace `Business.CallAPI.Services`, while the HTTP plumbing project is `Common.CallApi`
  (lowercase pi) with namespace `Common.CallApi`.

## Identity and the tenant connection string

There is no real auth here yet, but the header contract is already load-bearing:

- `WebFront\Controllers\BaseController.createPrincipalThread` builds a `CustomIdentity` (`Product = "ChatMe"`) and
  puts it on `Thread.CurrentPrincipal`.
- `Common.CallApi\HttpClientMessageHandnler` serializes it into an `X-ClientCode` header as
  `Name:Family:IdUser:Product:Token`.
- `Framework.Core\Header\InternalHeaderFactory.CreateEnvironmentThred` splits it back apart on the API side —
  it indexes `[0]`..`[3]` unguarded, so a request without a well-formed `X-ClientCode` throws before reaching
  the action. `MidlewareBaseController`'s constructor calls it, so every API controller must derive from it.
- `Family` then drives the EF connection string: Unity injects
  `EntityContextManagerChatbotDesarrollo(connectionString)` where the value is produced by
  `Framework.Core\Connection\ConnectionStringTypeConverter`, which calls `ConnectionStringSeguridadManager` and
  then TripleDES-decrypts the result in `ConnectionStringManager.BuildConnectionStringChatbotDesarrollo`.

**`ConnectionStringSeguridadManager.BuildConnectionStringQstomSeguridad` is a stub in this fork** — the CRM's
lookup of a per-tenant encrypted datasource was deleted (the `scSeguridad` local is read and discarded), so it
just returns the plaintext `QstomClientDataContext` connection string, which the decrypt step then mangles for
any `Family != "0"`. Expect to restore real tenant resolution before multi-tenant data access works; don't
assume the current path runs.

## Data model

Entity Framework 6 **Database First**, `ModelChatbotDesarrollo.Core\ModelChatbotDesarrollo.edmx`, DbContext
`Chatbot_DesarrolloEntities`, DB `ChatMeDB`. The model is near-empty by design: one placeholder entity
(`ChatsExample`) plus a few stored-proc/function result types inherited from the CRM
(`sp_IA_*`, `fn_Negocios_*`, `Chat_ConseguirConversaciones_*`) whose procs may not exist in `ChatMeDB`.

Grow the model by updating the EDMX from the database in Visual Studio — the `.tt` templates regenerate the POCOs.
Unlike `Botiseller-CRM`, this repo has **no `Base de datos\Releases\` folder**, so there is nowhere here to put a
migration script; decide with the team where `ChatMeDB` schema scripts live before adding tables.

The EF connection string named `Chatbot_DesarrolloEntities` exists only in
`ModelChatbotDesarrollo.Core\App.Config` (a class-library config, not loaded at runtime). The hosts' `Web.config`
files define `QstomSeguridadDataContext` / `QstomClientDataContext` / `MG2ControlDataContext` instead, and
`ConnectionStringTypeConverter` also falls back to a `QstomMasterDataContext` string that is **not** defined in
either `Web.config`.

`Web.config` in both hosts is committed with live shared-dev credentials and FTP secrets — assume any config edit
you make is going into git history.

## Scaffolding scars — expect these, don't chase them

- `DeliveryMailBusiness\`, `DeliveryMailService\`, `DeliveryServiceManual\` — leftover directories from
  `ModuleCampaign`. Each contains only a stale `.vs\*.dtbcache.json`; no `.csproj`, not in the solution.
- `WebFront\Src\` is a vendored SmartAdmin theme (hundreds of `.hbs` templates, vendor docs, `nav.json`). It is
  not application code — exclude it from searches.
- `WebFront\BotAdmin.csproj.user` — orphan from the project's earlier name.
- `Business.CallAPI\protos\` — the full Google API common-protos tree, unreferenced by any code here.
- `Swashbuckle.Core` is in `packages.config` but there is no `SwaggerConfig.cs` and nothing registers it, so the
  API exposes no Swagger UI despite the parent CLAUDE.md saying modules do.
- `WebApiMiddelware\OAuthConfig.Register` is an empty method; `Startup.cs` calls it and nothing else.
- `RegisterModules.cs` calls `.EnableInterfaceInterceptors()` on `SharedBusinessService`, but no interceptor is
  attached — the AOP/logging aspect was stripped, so the call is currently a no-op.
- `Business\Models\Connection.cs` + `ConnectionValidator` are the FluentValidation wiring example; they aren't
  used by any feature yet.
- `WebFront\App_Start\RouteConfig` registers a single catch-all route defaulting to
  `Authentication/Authentication`, so an unmatched URL lands on the login view rather than a 404.
