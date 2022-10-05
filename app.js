import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands } from "./commands.js";
import {
  azukiEmbed,
  beanzEmbed,
  blueEmbed,
  redEmbed,
  pairEmbed,
} from "./embeds.js";

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

    if (interaction.commandName === "azuki") {
      id >= 0 && id < 10000
        ? interaction.reply({
            embeds: await azukiEmbed(id),
          })
        : interaction.reply({
            content: `Azuki #${id} does not exist in the collection.`,
          });
    }

    if (interaction.commandName === "beanz") {
      id >= 0 && id < 19950
        ? interaction.reply({
            embeds: await beanzEmbed(id),
          })
        : interaction.reply({
            content: `Beanz #${id} does not exist in the collection.`,
          });
    }

    if (interaction.commandName === "blue") {
      id >= 0 && id < 10000
        ? interaction.reply({
            embeds: blueEmbed(id),
          })
        : interaction.reply({
            content: `Azuki #${id} does not exist in the collection.`,
          });
    }

    if (interaction.commandName === "red") {
      id >= 0 && id < 10000
        ? interaction.reply({
            embeds: redEmbed(id),
          })
        : interaction.reply({
            content: `Azuki #${id} does not exist in the collection.`,
          });
    }

    if (interaction.commandName === "pair") {
      const azukiId = interaction.options.get("azuki-id").value;
      const beanzId = interaction.options.get("beanz-id").value;

      azukiId >= 0 && azukiId < 10000 && beanzId >= 0 && beanzId < 19950
        ? interaction.reply({
            embeds: pairEmbed(azukiId, beanzId),
          })
        : interaction.reply({
            content: `Azuki #${azukiId} or Beanz #${beanzId} does not exist in the collection.`,
          });
    }
  } catch (error) {
    console.log(error.message);
  }
});
