import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands } from "./commands.js";
import {
  azukiInteraction,
  beanzInteraction,
  blueInteraction,
  redInteraction,
  pairInteraction,
} from "./interactions.js";

config();

const discordToken = process.env.DISCORD_TOKEN;
const AppId = process.env.APP_ID;
const GuildId = process.env.GUILD_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.login(discordToken);

const rest = new REST({
  version: "10",
}).setToken(discordToken);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(AppId, GuildId), {
      body: commands,
    });
  } catch (error) {
    console.log(error.message);
  }
})();

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    const id =
      interaction.commandName === "azuki" ||
      interaction.commandName === "beanz" ||
      interaction.commandName === "blue" ||
      interaction.commandName === "red"
        ? interaction.options.get("id").value
        : "";

    if (interaction.commandName === "azuki")
      await azukiInteraction(interaction, id);

    if (interaction.commandName === "beanz")
      await beanzInteraction(interaction, id);

    if (interaction.commandName === "blue") blueInteraction(interaction, id);

    if (interaction.commandName === "red") redInteraction(interaction, id);

    if (interaction.commandName === "pair") {
      const azukiId = interaction.options.get("azuki-id").value;
      const beanzId = interaction.options.get("beanz-id").value;

      pairInteraction(interaction, azukiId, beanzId);
    }
  } catch (error) {
    console.log(error.message);
  }
});
