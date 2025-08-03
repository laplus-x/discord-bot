import { EventType } from '@/types';
import { Client, ClientEvents, Events } from 'discord.js';

export const ready: EventType = {
    name: Events.ClientReady as keyof ClientEvents,
    once: true,
    execute: (client: Client) => {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};