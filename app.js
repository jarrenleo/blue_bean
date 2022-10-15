import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands } from "./commands.js";
import { getData } from "./fetch.js";
import {
  azukiInteraction,
  beanzInteraction,
  findInteraction,
  pairInteraction,
  blueInteraction,
  redInteraction,
  wallpaperInteraction,
} from "./interactions.js";

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

(async () => {
  try {
    await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });
  } catch (error) {
    console.log(error.message);
  }
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
      interaction.commandName === "azuki" ||
      interaction.commandName === "beanz" ||
      interaction.commandName === "find" ||
      interaction.commandName === "blue" ||
      interaction.commandName === "red" ||
      interaction.commandName === "wallpaper"
        ? interaction.options.get("id")?.value
        : "";

    if (interaction.commandName === "azuki")
      await azukiInteraction(interaction, id);

    if (interaction.commandName === "beanz")
      await beanzInteraction(interaction, id);

    if (interaction.commandName === "random") {
      const rng = Math.random();

      if (rng < 0.5) {
        const id = Math.floor(Math.random() * 10000);
        await azukiInteraction(interaction, id);
      } else {
        const id = Math.floor(Math.random() * 19950);
        await beanzInteraction(interaction, id);
      }
    }

    if (interaction.commandName === "find") {
      const name = interaction.options.get("name").value;
      const data = collectionData
        ? collectionData.find((result) => result.name === name)
        : "";

      await findInteraction(interaction, data, name, id);
    }

    if (interaction.commandName === "pair") {
      const azukiId = interaction.options.get("azuki-id").value;
      const beanzId = interaction.options.get("beanz-id").value;
      await pairInteraction(interaction, azukiId, beanzId);
    }

    if (interaction.commandName === "blue")
      await blueInteraction(interaction, id);

    if (interaction.commandName === "red")
      await redInteraction(interaction, id);

    if (interaction.commandName === "wallpaper")
      await wallpaperInteraction(interaction, id);
  } catch (error) {
    console.log(error);
  }
});
