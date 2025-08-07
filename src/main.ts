import 'reflect-metadata';

import { CommandCollection, CommandType, EnvironmentType } from "@/types";
import { Config } from "@/utilities";
import { ChatInputCommandInteraction, Client, Collection, EmbedBuilder, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import http from "http";
import * as commands from "./commands";
import * as events from "./events";

const config = Config.bind(EnvironmentType)

const client = new Client({
  intents:
    [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
    ]
}) as Client & CommandCollection;

client.commands = new Collection();

for (const command of Object.values(commands)) {
  client.commands.set(command.data.name, command);
}

const help: CommandType = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands')
    .addStringOption(option =>
      option
        .setName('command')
        .setDescription('command name')
        .setRequired(false)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const name = interaction.options.getString('command') ?? '';

    const builder = new EmbedBuilder().setTitle("Commands: ")

    const group = Object.values(commands).reduce<Record<string, CommandType[]>>((prev, curr) => {
      const k = curr.type ?? ''
      prev[k] ??= []
      prev[k].push(curr)
      return prev
    }, {})

    for (const [type, commands] of Object.entries(group)) {
      const field = {
        name: type.toUpperCase(),
        value: commands.filter(i => i.data.name.includes(name))
          .map(i => `- \`/${i.data.name}\` - ${i.data.description}` +
            (i.data.options.length > 0
              ? '\n' + i.data.options.map(opt => opt.toJSON()).map(opt => `> ${opt.name} - ${opt.description}`).join('\n')
              : ''))
          .join('\n'),
      }
      if (field.value.length > 0) builder.addFields(field)
    }
    await interaction.reply({ embeds: [builder], ephemeral: true });
  },
};

client.commands.set(help.data.name, help);

for (const event of Object.values(events)) {
  if (event.once) {
    client.once(event.name, event.execute);
  } else {
    client.on(event.name, event.execute);
  }
}

const rest = new REST().setToken(config.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${client.commands.size} application (/) commands.`);

    const body = client.commands.map(i => i.data.toJSON())

    await rest.put(
      Routes.applicationCommands(config.DISCORD_CLIENT_ID),
      { body },
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.DISCORD_GUILD_ID),
      { body },
    ) as any;

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();


client.login(config.DISCORD_TOKEN);

http.createServer(function (req, res) {
  res.write("alive")
  res.end()
}).listen(config.APP_PORT)