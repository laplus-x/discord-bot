import { CommandType } from '@/types';
import { SlashCommandBuilder } from 'discord.js';

export const ping: CommandType = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    execute: async (interaction: any) => {
        await interaction.reply('Pong!');
    },
};