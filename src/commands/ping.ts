import { CommandType } from '@/types';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const ping: CommandType = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply('Pong!');
    },
};