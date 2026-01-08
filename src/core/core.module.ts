import { Global, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import config from "../config";
import { TransformResponseInterceptor } from "./interceptors/transform-response/transform-response.interceptor";
import { LoggerService } from "./logger/logger-service";
import { LoggerMiddleware } from "./middleware/logger/logger.middleware";
import { DatabaseService } from "../database/database.service";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { CacheService } from "./cache/cache.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }), // for root makes .env available in the project
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.get("redis.host"),
        port: configService.get("redis.port"),
        username: configService.get("redis.username"),
        password: configService.get("redis.password"),
        no_ready_check: true,
        ttl: 10,
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },

    LoggerService,
    DatabaseService,
    CacheService,
  ],
  exports: [LoggerService, DatabaseService, CacheService],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
