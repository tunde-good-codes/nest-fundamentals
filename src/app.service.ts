import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "./core/logger/logger-service";

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {}
  getHello() {
    this.logger.log("app-service");
    const appName = this.configService.get<string>("APP_NAME");
    console.log(appName);

    return {
      data: "Hello to a new nestjs now World!",
      success: true,
      meta: {
        pages: 10,
      },
    };
  }
}
