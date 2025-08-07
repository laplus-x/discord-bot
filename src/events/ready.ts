import { ClientEventType } from '@/types';
import { Client, ClientEvents, Events } from 'discord.js';

export const ready: ClientEventType = {
    name: Events.ClientReady as keyof ClientEvents,
    once: true,
    execute: (client: Client) => {
        console.log(`Ready! Logged in as ${client.user?.tag}`);
    },
};