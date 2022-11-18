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
import { params, getId } from "./helpers.js";

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

    const id = interaction.options.get("id")?.value ?? null;

    switch (interaction.commandName) {
      case "azuki":
        await azukiInteraction(interaction, id);
        break;
      case "beanz":
        await beanzInteraction(interaction, id);
        break;
      case "random":
        const randomId = (size) => Math.floor(Math.random() * size);
        if (Math.random() < 0.5) {
          await azukiInteraction(interaction, randomId(10000));
        } else {
          await beanzInteraction(interaction, randomId(19950));
        }
        break;
      case "pair":
        const azukiId = interaction.options.get("azuki-id").value;
        const beanzId = interaction.options.get("beanz-id").value;
        await pairInteraction(interaction, azukiId, beanzId);
        break;
      case "find":
        const name = interaction.options.get("query").value;
        const data = collectionData
          ? collectionData.find((result) => result.name === name)
          : null;
        await findInteraction(interaction, data, name, id);
        break;
      case "village":
        await villageInteraction(interaction, twitterHandles);
    }
  } catch (error) {
    console.log(error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    if (interaction.customId) await interaction.deferUpdate();

    const commandName = interaction.message.interaction.commandName;

    if (commandName !== "village") {
      const embed = interaction.message.embeds;
      const id = getId(embed);

      switch (interaction.customId) {
        case "beanz":
        case "selfie":
          await beanzInteraction(interaction, id);
          break;
        case "update":
          const id2 = getId(embed, -1);
          await pairInteraction(interaction, id, id2);
      }
    } else await villageInteraction(interaction, twitterHandles);
  } catch (error) {
    console.log(error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isSelectMenu()) return;
  if (interaction.values) await interaction.deferUpdate();

  const id = getId(interaction.message.embeds);
  const [values] = interaction.values;

  switch (values) {
    case "azuki":
    case "profile":
    case "blue":
    case "red":
    case "racing":
      await azukiInteraction(interaction, id);
      break;
  }
});
