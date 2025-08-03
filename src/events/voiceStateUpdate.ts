import { EventType } from '@/types';
import { ClientEvents, Events, VoiceState } from 'discord.js';
import EventEmitter from 'stream';
import { match } from 'ts-pattern';

const EventName = {
    EnterVoiceChannel: "EnterVoiceChannel",
    LeaveVoiceChannel: "LeaveVoiceChannel",
    ChangeVoiceChannel: "ChangeVoiceChannel",
    StartScreenSharing: "StartScreenSharing",
    CloseScreenSharing: "CloseScreenSharing",
} as const

const events = new EventEmitter()

events.on(EventName.EnterVoiceChannel, (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    console.log(`${member.user.tag} enters voice channel #${newState.channelId}`);
})

events.on(EventName.LeaveVoiceChannel, (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    console.log(`${member.user.tag} leaves voice channel #${oldState.channelId}`);
})

events.on(EventName.ChangeVoiceChannel, (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    console.log(`${member.user.tag} leaves voice channel #${oldState.channelId}`);
    console.log(`${member.user.tag} enters voice channel #${newState.channelId}`);
})

events.on(EventName.StartScreenSharing, (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    console.log(`${member.user.tag} starts screen sharing`);
})

events.on(EventName.CloseScreenSharing, (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    console.log(`${member.user.tag} closes screen sharing`);
})

export const voiceStateUpdate: EventType = {
    name: Events.VoiceStateUpdate as keyof ClientEvents,
    once: false,
    execute: (oldState: VoiceState, newState: VoiceState) => {
        const channel = match(true)
            .when(() => oldState.channelId === null && newState.channelId !== null, () => EventName.EnterVoiceChannel)
            .when(() => oldState.channelId !== null && newState.channelId === null, () => EventName.LeaveVoiceChannel)
            .when(() => oldState.channelId !== newState.channelId, () => EventName.ChangeVoiceChannel)
            .otherwise(() => null)
        if (channel) events.emit(channel, oldState, newState)

        const streaming = match(true)
            .when(() => !oldState.streaming && newState.streaming, () => EventName.StartScreenSharing)
            .when(() => oldState.streaming && !newState.streaming, () => EventName.CloseScreenSharing)
            .otherwise(() => null)
        if (streaming) events.emit(streaming, oldState, newState)
    },
};