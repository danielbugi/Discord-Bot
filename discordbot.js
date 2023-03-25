const discord = require("discord.js");
const fs = require("fs");
const path = require("path");

const deployHandler = require("./deploy-commands");

const commandPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandPath)
  .filter((file) => file.endsWith(".js"));

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

require("dotenv").config();

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    // discord.GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildMembers,
  ],
});

// bot listener online
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.commands = new discord.Collection();

// for (const file of commandFiles) {
//   const filePath = path.join(commandPath, file);
//   const command = require(filePath);
//   // Set a new item in the Collection with the key as the command name and the value as the exported module
//   if ("data" in command && "execute" in command) {
//     client.commands.set(command.data.name, command);
//   } else {
//     console.log(
//       `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
//     );
//   }
// }

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

deployHandler.deployCommands();

// Log In our bot
client.login(process.env.CLIENT_TOKEN);
