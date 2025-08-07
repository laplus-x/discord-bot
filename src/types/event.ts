import { TransformDate } from "@/converters";
import { Expose, Type } from "class-transformer";

export const EventType = {
    EnterVoiceChannel: "EnterVoiceChannel",
    LeaveVoiceChannel: "LeaveVoiceChannel",
    ChangeVoiceChannel: "ChangeVoiceChannel",
    StartScreenSharing: "StartScreenSharing",
    CloseScreenSharing: "CloseScreenSharing",
} as const
export type EventType = typeof EventType[keyof typeof EventType];

export class EventTrackingResource {
    @Expose({ name: "id" })
    id: string;
    @Expose({ name: "type" })
    type: EventType;
    @Expose({ name: "channel_id" })
    channelId: string;
    @Expose({ name: "user_id" })
    userId: string;
    
    @Type(() => Date)
    @Expose({ name: "timestamp" })
    @TransformDate()
    timestamp: Date;
}