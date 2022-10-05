import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands } from "./commands.js";
import { azukiEmbed, beanzEmbed } from "./embeds.js";

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

(async function () {
  try {
    await rest.put(Routes.applicationGuildCommands(AppId, GuildId), {
      body: commands,
    });
  } catch (error) {
    console.log(error.message);
  }
})();

client.on("interactionCreate", async (interaction) => {
  const id = interaction.options.get("id").value;

  if (interaction.isChatInputCommand() && interaction.commandName === "azuki") {
    id >= 0 && id < 10000
      ? interaction.reply({
          embeds: await azukiEmbed(id),
        })
      : interaction.reply({
          content: `Azuki #${id} does not exist in the collection.`,
        });
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "beanz") {
    id >= 0 && id < 19950
      ? interaction.reply({
          embeds: await beanzEmbed(id),
        })
      : interaction.reply({
          content: `Beanz #${id} does not exist in the collection.`,
        });
  }
});
