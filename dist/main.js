"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const class_validator_1 = require("class-validator");
const app_service_1 = require("./modules/main/app.service");
const http_exception_filter_1 = require("./modules/common/filters/http-exception.filter");
const trim_strings_pipe_1 = require("./modules/common/transformer/trim-strings.pipe");
const app_module_1 = require("./modules/main/app.module");
const nest_winston_1 = require("nest-winston");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const swagger_1 = require("@nestjs/swagger");
const compression_1 = __importDefault(require("compression"));
const decimal_interceptor_1 = require("./modules/common/interceptors/decimal-interceptor");
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = yield core_1.NestFactory.create(app_module_1.AppModule);
    const logger = app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER);
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
    app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
    app.useLogger(logger);
    app.useGlobalInterceptors(new decimal_interceptor_1.DecimalInterceptor());
    app.useGlobalPipes(new trim_strings_pipe_1.TrimStringsPipe(), new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(logger));
    app.setGlobalPrefix('v1/api');
    app.disable('x-powered-by');
    app.enableCors({ origin: '*' });
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    appSwaggerDoc(app, app_module_1.imports);
    adminSwaggerDoc(app, app_module_1.adminModulesImports);
    yield app.listen(process.env.APP_PORT);
    app_service_1.AppService.startup();
});
const appSwaggerDoc = (app, modules) => {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('🌐 nearvendor')
        .setDescription('App Backend APIs')
        .setVersion('1.0')
        .addServer(`http://localhost:${process.env.APP_PORT}`, 'Local')
        .addServer('https://dplug-backend-303118176388.us-west1.run.app', 'Dev')
        .addServer('https://dplug-backend-303118176388.us-west1.run.app', 'Testing')
        .addServer('https://nearvendor-staging-api.rnssol.com', 'Staging')
        .addServer('https://api.nearvendor.com', 'Live')
        .addBearerAuth()
        .build();
    const options = {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
        include: modules,
    };
    const document = swagger_1.SwaggerModule.createDocument(app, config, options);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'Mobile | API Docs',
        customfavIcon: 'https://play-lh.googleusercontent.com/PGfKOUe2eR93IM4P7SpY7YJ0en_RFa92gZWur5VSWnR_qrTNR-7horCIYakEClBkGg=w240-h480-rw',
    });
};
const adminSwaggerDoc = (app, modules) => {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('🌐 nearvendor')
        .setDescription('Admin Backend APIs')
        .setVersion('1.0')
        .addServer(`http://localhost:${process.env.APP_PORT}`, 'Local')
        .addServer('https://dev-api.nearvendor.com', 'Dev')
        .addServer('https://nearvendor-backend-testing.rnssol.com', 'Testing')
        .addServer('https://nearvendor-staging-api.rnssol.com', 'Staging')
        .addServer('https://api.nearvendor.com', 'Live')
        .addBearerAuth()
        .build();
    const options = {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
        include: modules,
    };
    const document = swagger_1.SwaggerModule.createDocument(app, config, options);
    swagger_1.SwaggerModule.setup('/docs/admin', app, document, {
        customSiteTitle: 'Admin | API Docs',
        customfavIcon: 'https://play-lh.googleusercontent.com/PGfKOUe2eR93IM4P7SpY7YJ0en_RFa92gZWur5VSWnR_qrTNR-7horCIYakEClBkGg=w240-h480-rw',
    });
};
bootstrap()
    .then(() => console.log('Server started on ' + process.env.APP_PORT))
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map