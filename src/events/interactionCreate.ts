import { EventType } from '@/types';
import { ClientEvents, Events } from 'discord.js';

export const interactionCreate: EventType = {
    name: Events.InteractionCreate as keyof ClientEvents,
    once: true,
    execute: async (interaction: any) => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

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