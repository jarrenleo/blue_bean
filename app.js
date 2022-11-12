import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes, Events } from "discord.js";
import { commands } from "./commands.js";
import { getData } from "./fetch.js";
import {
  azukiInteraction,
  beanzInteraction,
  pairInteraction,
  findInteraction,
  villageInteraction,
} from "./interactions.js";
import { params } from "./helpers.js";

config();
const discordToken = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const twitterHandles = process.env.TWITTER_HANDLES;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.login(discordToken);

const rest = new REST({
  version: "10",
}).setToken(discordToken);

(async () => {
  await rest.put(Routes.applicationCommands(clientId), {
    body: commands,
  });
})();

let collectionData;

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isAutocomplete()) return;

    if (interaction.commandName === "find") {
      const query = interaction.options.getFocused();

      if (query) {
        collectionData = await getData(
          `https://api.reservoir.tools/collections/v5?${params(
            query
          )}=${query}&limit=5`
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
      interaction.commandName !== "pair" &&
      interaction.commandName !== "village"
        ? interaction.options.get("id")?.value
        : null;

    if (interaction.commandName === "azuki")
      await azukiInteraction(interaction, id);
    if (interaction.commandName === "beanz")
      await beanzInteraction(interaction, id);

    if (interaction.commandName === "random") {
      let id;
      const rng = Math.random();

      if (rng < 0.5) {
        id = Math.floor(Math.random() * 10000);
        await azukiInteraction(interaction, id);
      } else {
        id = Math.floor(Math.random() * 19950);
        await beanzInteraction(interaction, id);
      }
    }

    if (interaction.commandName === "pair") {
      const azukiId = interaction.options.get("azuki-id").value;
      const beanzId = interaction.options.get("beanz-id").value;
      await pairInteraction(interaction, azukiId, beanzId);
    }

    if (interaction.commandName === "find") {
      const name = interaction.options.get("query").value;
      const data = collectionData
        ? collectionData.find((result) => result.name === name)
        : null;
      await findInteraction(interaction, data, name, id);
    }

    if (interaction.commandName === "village")
      await villageInteraction(interaction, twitterHandles);
  } catch (error) {
    console.log(error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    if (interaction.customId) await interaction.deferUpdate();

    if (interaction.customId === "village" || interaction.customId === "reroll") {
      await villageInteraction(interaction, twitterHandles);
      return
    }

    const [{ data }] = interaction.message.embeds;
    const name = data.author.name;
    const defaultId = name.split(" ").at(1).slice(1);

    switch (interaction.customId) {
      case "azuki":
      case "blue":
      case "red":
      case "wallpaper":
        await azukiInteraction(interaction, defaultId);
        return
      case "beanz":
      case "selfie":
        await beanzInteraction(interaction, defaultId);
        return
      case "pair":
        const secondId = name.split(" ").at(-1).slice(1);
        await pairInteraction(interaction, defaultId, secondId);
        return
    }
  } catch (error) {
    console.log(error);
  }
});
