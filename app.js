import { config } from "dotenv";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Events,
  WebhookClient,
} from "discord.js";
import { MongoClient } from "mongodb";
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
import { isVerified, getId, getContract } from "./helpers.js";
import { monitor } from "./monitor.js";

config();
const discordToken = process.env.DISCORD_TOKEN;
const discordClientId = process.env.DISCORD_CLIENT_ID;
const mongoDBUri = process.env.MONGODB_URI;
const twitterHandles = process.env.TWITTER_HANDLES;

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds],
});
discordClient.login(discordToken);

(async function () {
  const rest = new REST({
    version: "10",
  }).setToken(discordToken);

  await rest.put(Routes.applicationCommands(discordClientId), {
    body: commands,
  });
})();

(async function () {
  const mongoDBClient = new MongoClient(mongoDBUri);
  await mongoDBClient.connect();
})();

let queryResults;
discordClient.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isAutocomplete() || interaction.commandName !== "find")
      return;

    const query = interaction.options.getFocused();
    if (query) {
      queryResults = await getData(
        `https://www.reservoir.market/api/reservoir/search/collections/v1?limit=5&name=${query}`,
        {}
      );

      await interaction.respond(
        queryResults.map((choice) => ({
          name: `${choice.name} ${isVerified(
            choice.openseaVerificationStatus
          )}`,
          value: choice.name,
        }))
      );
    }
  } catch (error) {
    console.log(error);
  }
});

discordClient.on("interactionCreate", async (interaction) => {
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
      case "pair":
        const azukiId = interaction.options.get("azuki-id").value;
        const beanzId = interaction.options.get("beanz-id").value;
        await pairInteraction(interaction, azukiId, beanzId);
        break;
      case "find":
        let query = interaction.options.get("query").value;

        if (query.length < 42) {
          let data = queryResults?.find((result) => result.name === query);

          if (!data)
            [data] = await getData(
              `https://www.reservoir.market/api/reservoir/search/collections/v1?limit=1&name=${query}`,
              {}
            );

          query = data?.contract;
        }

        await findInteraction(interaction, query, id);
        break;
      case "village":
        await villageInteraction(interaction, twitterHandles);
    }
  } catch (error) {
    console.log(error);
  }
});

discordClient.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    if (interaction.customId) await interaction.deferUpdate();

    const embed = interaction.message.embeds;
    const data = embed[0]?.data;

    switch (interaction.customId) {
      case "collection":
        const collectionContract = getContract(data);
        await findInteraction(interaction, collectionContract);
        break;
      case "listings":
        const listingsContract = getContract(data);
        const name = data.title;
        const links = data.fields.slice(-3);
        await listingsInteraction(interaction, listingsContract, name, links);
        break;
      case "refresh":
        const id = getId(data);
        const id2 = getId(data, -1);
        await pairInteraction(interaction, id, id2);
        break;
      case "reroll":
        await villageInteraction(interaction, twitterHandles);
    }
  } catch (error) {
    console.log(error);
  }
});

discordClient.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.values) await interaction.deferUpdate();

  const id = getId(interaction.message.embeds[0].data);
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

setInterval(async function () {
  await monitor(
    new WebhookClient({
      url: process.env.LISTINGS_WEBHOOK,
    })
  );
}, 5000);
