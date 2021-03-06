"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var app_component_1 = require('./components/app.component');
var app_routes_1 = require('./components/app.routes');
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
var formData_service_1 = require('./services/formData.service');
core_1.enableProdMode();
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [forms_1.disableDeprecatedForms(), forms_1.provideForms(), app_routes_1.APP_ROUTER_PROVIDERS, http_1.HTTP_PROVIDERS, formData_service_1.FormDataService]);

//# sourceMappingURL=main.js.map
