using System.Web.Optimization;

namespace WebFront
{
    public class BundleConfig
    {
        // Para obtener más información acerca de Bundling, consulte http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            /* Base JS y CSS del Login */
            bundles.Add(new ScriptBundle("~/javascripts/login").Include(
                        "~/Js/vendors.bundle.js",
                        "~/Js/app.bundle.js",
                        "~/Js/notifications/sweetalert2/sweetalert2.bundle.js",
                        "~/Js/notifications/toastr/toastr.js",
                        "~/Js/jquery.base64.js",
                        "~/Js/loader/loader.js",
                        "~/Scripts" + Common.Utility.Helper.getVersionScript() + "/Site/site.js",
                        "~/Js/cookie.js",
                        "~/Js/refreshCache.js",
                        "~/Scripts" + Common.Utility.Helper.getVersionScript() + "/Enums/Enums.js",
                        "~/Scripts" + Common.Utility.Helper.getVersionScript() + "/Factorys/FactoryAuthentication.js",
                        "~/Scripts" + Common.Utility.Helper.getVersionScript() + "/Factorys/FactoryShared.js"
            ));

            bundles.Add(new StyleBundle("~/estilo/login").Include(
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/vendors.bundle.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/app.bundle.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/skins/skin-master.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/fa-brands.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/notifications/toastr/toastr.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/notifications/sweetalert2/sweetalert2.bundle.css",
                "~/Content" + Common.Utility.Helper.getVersionScript() + "/site/site.css"
            ));
            /* Fin Base JS y CSS */

            /* Base JS y CSS del Sitio principal */
            bundles.Add(new ScriptBundle("~/javascripts/site").Include(
                        "~/Js/vendors.bundle.js",
                        "~/Js/app.bundle.js",
                        "~/Js/notifications/sweetalert2/sweetalert2.bundle.js",
                        "~/Js/notifications/toastr/toastr.js",
                        "~/Js/moment/moment.js",
                        "~/Js/formplugins/bootstrap-datepicker/bootstrap-datepicker.js",
                        "~/Js/formplugins/bootstrap-daterangepicker/bootstrap-daterangepicker.js",
                        "~/Js/jquery.base64.js",
                        "~/Js/file/File.js",
                        "~/Js/formplugins/select2/select2.bundle.js",
                        "~/Js/datagrid/datatables/datatables.bundle.js",
                        "~/Js/datagrid/datatables/datatables.export.js",
                        "~/Js/formplugins/inputmask/inputmask.bundle.js",
                        "~/Js/formplugins/summernote/summernote.js",
                        "~/Js/formplugins/ion-rangeslider/ion-rangeslider.js",
                        "~/Js/loader/loader.js",
                        "~/Js/pagination/Pagination.js",
                        "~/Js/pagination/PaginationDos.js",
                        "~/Js/excel/jzip.js",
                        "~/Js/excel/xlsx.full.min.js",
                        "~/Scripts" + Common.Utility.Helper.getVersionScript() + "/Enums/Enums.js",
                        "~/Js/cookie.js",
                        "~/Js/refreshCache.js",
                        "~/Scripts" + Common.Utility.Helper.getVersionScript() + "/Site/site.js",
                        "~/Js/jsPDF/jspdf.min.js"
            ));

            bundles.Add(new StyleBundle("~/estilo/site").Include(
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/vendors.bundle.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/app.bundle.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/skins/skin-master.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/fa-brands.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/fa-solid.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/formplugins/bootstrap-datepicker/bootstrap-datepicker.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/formplugins/bootstrap-daterangepicker/bootstrap-daterangepicker.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/formplugins/select2/select2.bundle.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/datagrid/datatables/datatables.bundle.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/notifications/sweetalert2/sweetalert2.bundle.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/notifications/toastr/toastr.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/miscellaneous/reactions/reactions.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/formplugins/summernote/summernote.css",
                "~/Css" + Common.Utility.Helper.getVersionScript() + "/formplugins/ion-rangeslider/ion-rangeslider.css",
                "~/Content" + Common.Utility.Helper.getVersionScript() + "/site/site.css"
            ));

            bundles.Add(new ScriptBundle("~/javascripts/factoryAndShared").Include(

                        "~/Scripts" + Common.Utility.Helper.getVersionScript() + "/Factorys/FactoryAuthentication.js",
                       "~/Scripts" + Common.Utility.Helper.getVersionScript() + "/Factorys/FactoryShared.js",
                        "~/Scripts" + Common.Utility.Helper.getVersionScript() + "/Models/Shared/Controles/Controles.js"

            ));
            /* Fin Base JS y CSS */








            /* Knockout */
            bundles.Add(new ScriptBundle("~/javascripts/knockout").Include(
                        "~/Js/knockout/knockout-3.4.2.js",
                        "~/Js/knockout/knockout.validation.min.js",
                        "~/Js/knockout/AdaptKO.js"
            ));

            /* Sammy */
            bundles.Add(new ScriptBundle("~/javascripts/sammy").Include(
                        "~/Js/sammy/sammy-0.7.5.min.js",
                        "~/Scripts" + Common.Utility.Helper.getVersionScript() + "/Sammy/Main.Sammy.js"
           ));

            /* Linq */
            bundles.Add(new ScriptBundle("~/javascripts/linq").Include(
                         "~/Js/linq/linq.js"
            ));
        }
    }
}
