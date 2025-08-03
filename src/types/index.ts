import { ClientEvents, Collection, SlashCommandBuilder } from 'discord.js';

export type CommandCollection = { commands: Collection<string, any> }

export type CommandType = {
    data: SlashCommandBuilder
    execute: (...args: any) => Promise<void>
}

export type EventType = {
    name: keyof ClientEvents
    once: boolean,
    execute: (...args: any) => void
}