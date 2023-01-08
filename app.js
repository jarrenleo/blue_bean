import { config } from "dotenv";
import { Client, GatewayIntentBits, REST, Routes, Events } from "discord.js";
import { commands } from "./commands.js";
import { getData } from "./fetch.js";
import {
  azukiInteraction,
  beanzInteraction,
  pairInteraction,
  findInteraction,
  listingsInteraction,
  villageInteraction,
} from "./interactions.js";
import {
  isVerified,
  getParams,
  getId,
  getContract,
  getEmbedFields,
} from "./helpers.js";

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
      const query = interaction.options.getFocused();
      if (query) {
        collectionData = await getData(
          `https://api.reservoir.tools/collections/v5?${getParams(
            query
          )}=${query}&includeTopBid=true&useNonFlaggedFloorAsk=true&limit=5`
        );
        const choices = collectionData.map((result) => {
          return {
            name: result.name,
            verificationStatus: result.openseaVerificationStatus,
          };
        });
        await interaction.respond(
          choices.map((choice) => ({
            name: `${choice.name}${isVerified(choice.verificationStatus)}`,
            value: choice.name,
          }))
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

    let id;
    switch (interaction.commandName) {
      case "azuki":
      case "beanz":
      case "find":
        id = interaction.options.get("id")?.value;
    }

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
        const data = collectionData?.find((result) => result.name === name);
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
    const embed = interaction.message.embeds;

    switch (commandName) {
      case "pair":
        const id = getId(embed);
        const id2 = getId(embed, -1);
        await pairInteraction(interaction, id, id2);
        break;
      case "village":
        await villageInteraction(interaction, twitterHandles);
    }

    switch (interaction.customId) {
      case "collection":
        const collectionFields = getEmbedFields(embed);
        const collectionContract =
          collectionFields.length !== 13
            ? getContract(collectionFields, 3)
            : getContract(collectionFields, 9);

        await findInteraction(interaction, null, collectionContract);
        break;
      case "listings":
        const listingsFields = getEmbedFields(embed);
        const listingsContract =
          listingsFields.length === 13
            ? getContract(listingsFields, 9)
            : getContract(listingsFields, 3);
        const name = embed.at(0).data.title;
        const links = listingsFields.slice(-3);

        await listingsInteraction(interaction, listingsContract, name, links);
    }
  } catch (error) {
    console.log(error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.values) await interaction.deferUpdate();

  const id = getId(interaction.message.embeds);
  const [values] = interaction.values;

  switch (values) {
    case "azuki":
    case "profile":
    case "dragon":
    case "blue":
    case "red":
    case "rbr":
    case "santa":
    case "white":
    case "black":
    case "bblue":
    case "bred":
    case "bwater":
    case "bfire":
    case "bearth":
    case "belectric":
    case "gold":
    case "spirit":
      await azukiInteraction(interaction, id);
      break;
    case "beanz":
    case "transparent":
    case "selfie":
    case "portrait":
    case "beanz_santa":
      await beanzInteraction(interaction, id);
  }
});
