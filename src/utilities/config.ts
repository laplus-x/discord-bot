import { Constructor } from "@/types"
import { plainToClass } from "class-transformer"
import { config } from "dotenv"

export class Config {
    public static bind<T>(out: Constructor<T>): T {
        const raw = config()
        return plainToClass(out, raw.parsed ?? {}, { exposeUnsetFields: false, enableImplicitConversion: true })
    }
}