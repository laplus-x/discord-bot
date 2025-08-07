import { ClientEvents, Collection, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

export type CommandCollection = { commands: Collection<string, any> }

export type CommandType = {
    type?: string,
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
    execute: (...args: any) => Promise<void>
}

export type ClientEventType = {
    name: keyof ClientEvents
    once: boolean,
    execute: (...args: any) => void
}

