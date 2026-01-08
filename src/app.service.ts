import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "./core/logger/logger-service";
import { DatabaseService } from "./database/database.service";

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly databaseService: DatabaseService
  ) {}
  getHello() {
    this.logger.log("app-service");
    const appName = this.configService.get<string>("APP_NAME");
    this.databaseService.user.findMany();
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
