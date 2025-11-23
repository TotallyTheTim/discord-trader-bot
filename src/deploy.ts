import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';

// Load environment variables
config();

const commands: any[] = [];

// Determine file extension based on environment (development uses .ts, production uses .js)
const isProduction = __dirname.includes('dist');
const fileExtension = isProduction ? '.js' : '.ts';

// Load all command files
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith(fileExtension)
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

// Deploy commands
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) command(s).`
    );

    const clientId = process.env.CLIENT_ID!;

    // Register commands globally
    const data: any = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) command(s).`
    );
  } catch (error) {
    console.error(error);
  }
})();

