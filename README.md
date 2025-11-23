# Discord Form Bot

A TypeScript Discord bot that uses Discord Modals to create custom form inputs. Built with discord.js v14.

## Features

- Slash command `/form` that opens a modal with:
  - Short text input (nameInput)
  - Paragraph input (messageInput)
- Posts collected answers to the channel when submitted
- Clean, organized project structure
- Auto-loading commands and events

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Discord bot token and application client ID

## Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd discord-form-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Discord bot token and client ID:
     ```
     DISCORD_TOKEN=your_bot_token_here
     CLIENT_ID=your_client_id_here
     ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Deploy slash commands:**
   ```bash
   npm run deploy
   ```
   This registers the `/form` command globally with Discord.

6. **Start the bot:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Project Structure

```
discord-form-bot/
├── src/
│   ├── index.ts              # Main bot file with auto-loading
│   ├── commands/
│   │   └── form.ts           # Form slash command
│   ├── events/
│   │   ├── interactionCreate.ts  # Handle interactions
│   │   └── ready.ts          # Bot ready event
│   └── deploy.ts             # Command deployment script
├── dist/                     # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── .env                      # Environment variables (create from .env.example)
└── README.md
```

## Usage

1. Invite your bot to a Discord server with the following permissions:
   - `applications.commands` (to use slash commands)
   - `Send Messages` (to post form responses)

2. Use the `/form` command in any channel where the bot has access.

3. Fill out the modal that appears with:
   - **Name**: A short text input
   - **Message**: A paragraph text input

4. Submit the form, and the bot will post the collected information as an embed in the channel.

## Scripts

- `npm run dev` - Run the bot in development mode with auto-reload (nodemon + ts-node)
- `npm run deploy` - Deploy/register slash commands globally
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled bot (requires build first)

## Development

The bot uses TypeScript and automatically loads commands and events from their respective directories. To add new commands:

1. Create a new file in `src/commands/`
2. Export a `data` property (SlashCommandBuilder) and an `execute` function
3. Rebuild and redeploy commands

## Notes

- Commands are registered globally, which may take up to an hour to propagate. For faster testing, use guild-specific commands during development.
- Make sure your bot has the necessary intents enabled in the Discord Developer Portal.
- The bot requires the `Guilds` intent to function properly.

