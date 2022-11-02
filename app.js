import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands } from "./commands.js";
import { getData } from "./fetch.js";
import { mainInteraction, othersInteraction } from "./interactions.js";

config();
const discordToken = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.login(discordToken);

const rest = new REST({
  version: "10",
}).setToken(discordToken);

(async function () {
  await rest.put(Routes.applicationCommands(clientId), {
    body: commands,
  });
})();

let collectionData;

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isAutocomplete()) return;

    if (interaction.commandName === "find") {
      const focusedValue = interaction.options.getFocused();
      if (focusedValue) {
        collectionData = await getData(
          `https://api.reservoir.tools/collections/v5?name=${focusedValue}&limit=5`
        );
        const choices = collectionData.map((result) => result.name);
        await interaction.respond(
          choices.map((choice) => ({ name: choice, value: choice }))
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName) await interaction.deferReply();

    const id =
      interaction.commandName &&
      interaction.commandName !== "random" &&
      interaction.commandName !== "pair"
        ? interaction.options.get("id")?.value
        : null;

    if (
      interaction.commandName === "azuki" ||
      interaction.commandName === "beanz"
    )
      await mainInteraction(interaction, null, interaction.commandName, id);

    if (interaction.commandName === "random") {
      let id;
      const rng = Math.random();

      if (rng < 0.5) {
        id = Math.floor(Math.random() * 10000);
        await mainInteraction(interaction, null, "azuki", id);
      } else {
        id = Math.floor(Math.random() * 19950);
        await mainInteraction(interaction, null, "beanz", id);
      }
    }

    if (interaction.commandName === "find") {
      const name = interaction.options.get("name").value;
      const data = collectionData
        ? collectionData.find((result) => result.name === name)
        : null;
      await mainInteraction(interaction, data, name, id);
    }

    if (
      interaction.commandName === "blue-jacket" ||
      interaction.commandName === "red-jacket" ||
      interaction.commandName === "wallpaper"
    )
      await othersInteraction(interaction, id);

    if (interaction.commandName === "selfie")
      await othersInteraction(interaction, null, id);

    if (interaction.commandName === "pair") {
      const azukiId = interaction.options.get("azuki-id").value;
      const beanzId = interaction.options.get("beanz-id").value;
      await othersInteraction(interaction, azukiId, beanzId);
    }
  } catch (error) {
    console.log(error);
  }
});
