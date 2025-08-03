# Discord Bot

A TypeScript-powered Discord bot using [discord.js](https://discord.js.org/), featuring modular command and event handling, voice state tracking, and screen sharing notifications.

---

## Features

- Slash command support (e.g., `/ping`, `/help`)
- Voice channel join/leave/change detection
- Screen sharing start/stop notifications
- Modular command/event architecture
- Environment-based configuration
- Ready for deployment on [Render](https://render.com/)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- [bun](https://bun.sh/) (for install/build scripts)
- Discord bot token and IDs

### Installation

```sh
bun install
```

### Development

```sh
bun run dev
```

---

## Project Structure

```
src/
  main.ts                # Bot entrypoint
  commands/              # Slash command modules
    ping.ts              # Example 'ping' command
    index.ts             # Command exports
  events/                # Discord event handlers
    ready.ts             # Bot ready event
    interactionCreate.ts # Slash command dispatcher
    voiceStateUpdate.ts  # Voice state tracking
    index.ts             # Event exports
  types/                 # Shared types/interfaces
    index.ts
.env                     # Environment variables
render.yaml              # Render deployment config
.github/workflows/       # CI/CD workflow
```

---

## Commands

- `/ping`  
  Replies with "Pong!"

- `/help`  
  Lists all available commands and their options.

Commands are defined in [`src/commands/ping.ts`](src/commands/ping.ts ) and registered in [`src/main.ts`](src/main.ts ).

---

## Events

- **Ready**: Logs bot login ([`src/events/ready.ts`](src/events/ready.ts ))
- **InteractionCreate**: Handles slash command execution ([`src/events/interactionCreate.ts`](src/events/interactionCreate.ts ))
- **VoiceStateUpdate**: Tracks voice channel and screen sharing changes ([`src/events/voiceStateUpdate.ts`](src/events/voiceStateUpdate.ts ))

---

## Configuration

Set the following environment variables in [`.env`](.env ):

```
DISCORD_TOKEN=your-bot-token
DISCORD_CLIENT_ID=your-client-id
DISCORD_GUILD_ID=your-guild-id
APP_PORT=3000
```

---

## Deployment

Deploy to [Render](https://render.com/) using [`render.yaml`](render.yaml ).  
CI/CD is configured via GitHub Actions.

---

## License

This project is private and not licensed for distribution.  
See [`package.json`](package.json ) for details.

---

## References

- [discord.js Documentation](https://discord.js.org/#/docs/main/stable/general/welcome)