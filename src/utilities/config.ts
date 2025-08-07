import { Constructor } from "@/types"
import { plainToClass } from "class-transformer"
import { config } from "dotenv"

export class Config {
    public static bind<T>(out: Constructor<T>): T {
        const raw = config()
        const data = Object.assign(raw.parsed ?? {}, process.env)
        return plainToClass(out, data, { exposeUnsetFields: false, enableImplicitConversion: true })
    }
}