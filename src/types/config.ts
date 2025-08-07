import { Expose } from "class-transformer";

export class EnvironmentType {
    @Expose()
    APP_PORT: number;

    @Expose()
    DISCORD_TOKEN: string;
    @Expose()
    DISCORD_CLIENT_ID: string;
    @Expose()
    DISCORD_GUILD_ID: string;

    @Expose()
    SHEET_ID: string;
    @Expose()
    GOOGLE_APPLICATION_CREDENTIALS: string;
}