import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes, Events } from "discord.js";
import { commands } from "./commands.js";
import { getData } from "./fetch.js";
import {
  azukiInteraction,
  beanzInteraction,
  pairInteraction,
  findInteraction,
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
  await rest.put(Routes.applicationCommands(clientId), {
    body: commands,
  });
})();

let collectionData;

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isAutocomplete()) return;

    if (interaction.commandName === "find") {
      const focusedText = interaction.options.getFocused();
      if (focusedText) {
        collectionData = await getData(
          `https://api.reservoir.tools/collections/v5?name=${focusedText}&limit=5`
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
      const name = interaction.options.get("name").value;
      const data = collectionData
        ? collectionData.find((result) => result.name === name)
        : null;
      await findInteraction(interaction, data, name, id);
    }
  } catch (error) {
    console.log(error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    if (interaction.customId) await interaction.deferUpdate();

    const [{ data }] = interaction.message.embeds;
    const i = data.author.name.indexOf("#") + 1;
    const id = data.author.name.slice(i);

    interaction.customId !== "beanz" && interaction.customId !== "selfie"
      ? await azukiInteraction(interaction, id)
      : await beanzInteraction(interaction, id);
  } catch (error) {
    console.log(error);
  }
});
