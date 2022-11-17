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
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
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
      const [{ data }] = interaction.message.embeds;
      const name = data.author.name;
      const id = name.split(" ").at(1).slice(1);

      switch (interaction.customId) {
        case "azuki":
        case "profile":
        case "blue":
        case "red":
        case "racer":
          await azukiInteraction(interaction, id);
          break;
        case "beanz":
        case "selfie":
          await beanzInteraction(interaction, id);
          break;
        case "update":
          const id2 = name.split(" ").at(-1).slice(1);
          await pairInteraction(interaction, id, id2);
      }
    } else await villageInteraction(interaction, twitterHandles);
  } catch (error) {
    console.log(error);
  }
});

client.on(Events.MessageCreate, function (message) {
  const options = [
    ["candice", "Candice dick fit in yo mouth"],
    ["dragon", "Dragon deez nuts across yo face"],
    ["deez", "Deez nuts in yo mouth lmao"],
    ["kombucha", "Kombucha mouth on deez nuts"],
    ["landon", "Landon deez nuts"],
    ["rhydon", "Rhydon this cock"],
    ["sawcon", "Sawcon deez nuts"],
    ["space", "Space for deez nuts in yo mouth"],
    ["watch", "Watch me drag deez nuts across your face"],
    ["wendys", "Wendys balls goes to your mouth"],
    ["wilma", "Wilma nuts fit in yo mouth"],
  ];

  for (const i of options) {
    const whitelist = () => {
      if (
        message.content.toLowerCase().includes(`${i.at(0)}`) &&
        message.author.id !== "1030118282101014630"
      )
        return true;
      return false;
    };
    if (!message.mentions.repliedUser && whitelist())
      message.channel.send(`${i.at(1)}`);

    if (message.mentions.repliedUser && whitelist())
      message.channel.send({
        content: `<@${message.mentions.repliedUser.id}> ${i.at(1)}`,
      });
  }
});
