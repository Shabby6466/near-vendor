import { MiddlewareConsumer, ModuleMetadata, NestModule } from "@nestjs/common";
export declare const adminModulesImports: ModuleMetadata["imports"];
export declare const imports: ModuleMetadata["imports"];
export declare class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
}
