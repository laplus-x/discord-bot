import { Client, Collection, GatewayIntentBits, REST, Routes } from "discord.js";
import { config } from "dotenv";
import http from "http";
import * as commands from "./commands";
import * as events from "./events";
import { CommandCollection } from "./types";

config()

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

for (const event of Object.values(events)) {
  if (event.once) {
    client.once(event.name, event.execute);
  } else {
    client.on(event.name, event.execute);
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${client.commands.size} application (/) commands.`);

    const body = Object.values(commands).map(i => i.data.toJSON())

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body },
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      { body },
    ) as any;

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();


client.login(process.env.DISCORD_TOKEN);

http.createServer(function (req, res) {
  res.write("alive")
  res.end()
}).listen(process.env.APP_PORT)