import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';

// Load environment variables
config();

// Extend Client to include commands collection
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, any>;
  }
}

// Create client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Initialize commands collection
client.commands = new Collection();

// Determine file extension based on environment (development uses .ts, production uses .js)
const isProduction = __dirname.includes('dist');
const fileExtension = isProduction ? '.js' : '.ts';

// Load commands
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith(fileExtension)
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Load events
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter((file) =>
  file.endsWith(fileExtension)
);

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Login to Discord
client.login(process.env.DISCORD_TOKEN);

