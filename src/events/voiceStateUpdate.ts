import { EventTracking } from '@/repositories';
import { ClientEventType, EventTrackingResource, EventType } from '@/types';
import { Functions } from '@/utilities';
import { ClientEvents, Events, VoiceState } from 'discord.js';
import { nanoid } from 'nanoid';
import EventEmitter from 'stream';
import { match } from 'ts-pattern';

const events = new EventEmitter()

events.on(EventType.EnterVoiceChannel, async (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    console.log(`${member?.user.tag} enters voice channel #${newState.channelId}`);
    
    const event = Object.assign(new EventTrackingResource(), {
        id: nanoid(),
        type: EventType.EnterVoiceChannel,
        channelId: newState.channelId || '',
        userId: member?.user.id ?? '',
        timestamp: new Date()
    })

    const tracking = await EventTracking.getInstance();
    const { ok, val } = await Functions.wrapAsync<void, Error>(() => tracking.append(event));
    if (!ok) {
        console.error(`Failed to track event: ${val.message}`);
    }
})

events.on(EventType.LeaveVoiceChannel, async (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    console.log(`${member?.user.tag} leaves voice channel #${oldState.channelId}`);
    
    const event = Object.assign(new EventTrackingResource(), {
        id: nanoid(),
        type: EventType.LeaveVoiceChannel,
        channelId: oldState.channelId || '',
        userId: member?.user.id ?? '',
        timestamp: new Date()
    })

    const tracking = await EventTracking.getInstance();
    const { ok, val } = await Functions.wrapAsync<void, Error>(() => tracking.append(event));
    if (!ok) {
        console.error(`Failed to track event: ${val.message}`);
    }
})

events.on(EventType.ChangeVoiceChannel, async (oldState: VoiceState, newState: VoiceState) => {
    events.emit(EventType.LeaveVoiceChannel, oldState, newState);
    events.emit(EventType.EnterVoiceChannel, oldState, newState);
})

events.on(EventType.StartScreenSharing, async (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    console.log(`${member?.user.tag} starts screen sharing`);
    
    const event = Object.assign(new EventTrackingResource(), {
        id: nanoid(),
        type: EventType.StartScreenSharing,
        channelId: oldState.channelId || newState.channelId || '',
        userId: member?.user.id ?? '',
        timestamp: new Date()
    })

    const tracking = await EventTracking.getInstance();
    const { ok, val } = await Functions.wrapAsync<void, Error>(() => tracking.append(event));
    if (!ok) {
        console.error(`Failed to track event: ${val.message}`);
    }
})

events.on(EventType.CloseScreenSharing, async (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    console.log(`${member?.user.tag} closes screen sharing`);
    
    const event = Object.assign(new EventTrackingResource(), {
        id: nanoid(),
        type: EventType.CloseScreenSharing,
        channelId: oldState.channelId || newState.channelId || '',
        userId: member?.user.id ?? '',
        timestamp: new Date()
    })
    
    const tracking = await EventTracking.getInstance();
    const { ok, val } = await Functions.wrapAsync<void, Error>(() => tracking.append(event));
    if (!ok) {
        console.error(`Failed to track event: ${val.message}`);
    }
})

export const voiceStateUpdate: ClientEventType = {
    name: Events.VoiceStateUpdate as keyof ClientEvents,
    once: false,
    execute: (oldState: VoiceState, newState: VoiceState) => {
        const channel = match(true)
            .when(() => oldState.channelId === null && newState.channelId !== null, () => EventType.EnterVoiceChannel)
            .when(() => oldState.channelId !== null && newState.channelId === null, () => EventType.LeaveVoiceChannel)
            .when(() => oldState.channelId !== newState.channelId, () => EventType.ChangeVoiceChannel)
            .otherwise(() => null)
        if (channel) events.emit(channel, oldState, newState)

        const streaming = match(true)
            .when(() => !oldState.streaming && newState.streaming, () => EventType.StartScreenSharing)
            .when(() => oldState.streaming && !newState.streaming, () => EventType.CloseScreenSharing)
            .otherwise(() => null)
        if (streaming) events.emit(streaming, oldState, newState)
    },
};