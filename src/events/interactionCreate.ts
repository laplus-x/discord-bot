import { CommandCollection, EventType } from '@/types';
import { Client, ClientEvents, Events, Interaction } from 'discord.js';

export const interactionCreate: EventType = {
    name: Events.InteractionCreate as keyof ClientEvents,
    once: false,
    execute: async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const { commands } = interaction.client as Client & CommandCollection

        const command = commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
        }
    },
};