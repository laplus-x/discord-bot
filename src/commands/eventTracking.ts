import { ClassConverter } from '@/converters';
import { EventTracking } from '@/repositories';
import { CommandType } from '@/types';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { table } from 'table';

export const eventQuery: CommandType = {
    type: "eventTracking",
    data: new SlashCommandBuilder()
        .setName('event-tracking-query')
        .setDescription('Query raw data by range')
        .addStringOption(option =>
            option
                .setName('start')
                .setDescription('A1 Notation')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('end')
                .setDescription('A1 Notation')
                .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const start = interaction.options.getString('start', true);
        const end = interaction.options.getString('end', true);

        const eventTracking = await EventTracking.getInstance();

        const data = await eventTracking.get(start, end);

        if (data.length === 0) {
            await interaction.reply({ content: 'No data found for the specified range.' });
            return
        }

        const users = interaction.client.users.cache;
        const channels = interaction.client.channels.cache;

        const header = Object.keys(data[0]);
        const rows = data.map(i => {
            const user = users.get(i.userId);
            i.userId = user?.username ?? i.userId;

            const channel = channels.get(i.channelId) as any;
            i.channelId = channel?.name ?? i.channelId;

            const data = ClassConverter.serialize(i)
            return Object.values(data)
        })

        const content = table([header, ...rows], {
            columnDefault: {
                width: 10,
            },
            drawVerticalLine: (lineIndex, columnCount) => lineIndex === 0 || lineIndex === columnCount
        })
        if (content.length > 2000) {
            await interaction.reply({ content: 'Data is too large to display in a single message.' });
            return;
        }
        console.log(content)
        await interaction.reply({ content: '```' + content + '```' });
    },
};