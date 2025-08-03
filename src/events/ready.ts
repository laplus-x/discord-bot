import { EventType } from '@/types';
import { ClientEvents, Events } from 'discord.js';

export const ready: EventType = {
    name: Events.ClientReady as keyof ClientEvents,
    once: true,
    execute: (client: any) => {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};