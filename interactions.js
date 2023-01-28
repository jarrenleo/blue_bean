import {
  azukiEmbed,
  beanzEmbed,
  pairEmbed,
  collectionEmbed,
  tokenEmbed,
  listingsEmbed,
} from "./embeds.js";
import {
  azukiMenu,
  beanzMenu,
  collectionButton,
  refreshButton,
  rerollButton,
} from "./components.js";
import { shuffle } from "./helpers.js";

const azukiIdRange = (id) => id >= 0 && id < 10000;
const beanzIdRange = (id) => id >= 0 && id < 19950;

export const azukiInteraction = async (interaction, id) => {
  if (interaction.type === 2) {
    azukiIdRange(id)
      ? await interaction.editReply({
          embeds: await azukiEmbed(id, "azuki"),
          components: azukiMenu,
        })
      : await interaction.editReply({
          content: `Azuki #${id} does not exist in the collection.`,
        });
  }

  if (interaction.type === 3) {
    await interaction.editReply({
      embeds: await azukiEmbed(id, ...interaction.values),
      components: azukiMenu,
    });
  }
};

export const beanzInteraction = async (interaction, id) => {
  if (interaction.type === 2) {
    beanzIdRange(id)
      ? await interaction.editReply({
          embeds: await beanzEmbed(id, "beanz"),
          components: beanzMenu,
        })
      : await interaction.editReply({
          content: `Beanz #${id} does not exist in the collection.`,
        });
  }

  if (interaction.type === 3) {
    await interaction.editReply({
      embeds: await beanzEmbed(id, ...interaction.values),
      components: beanzMenu,
    });
  }
};

export const pairInteraction = async (interaction, azukiId, beanzId) => {
  azukiIdRange(azukiId) && beanzIdRange(beanzId)
    ? await interaction.editReply({
        embeds: await pairEmbed(azukiId, beanzId),
        components: refreshButton,
      })
    : await interaction.editReply({
        content: `Azuki #${azukiId} or Beanz #${beanzId} does not exist in the collection.`,
      });
};

export const findInteraction = async (interaction, contract, id) => {
  try {
    if (!contract)
      throw new Error(
        "Collection not found. Please use suggested options that best match your query."
      );

    let reply;
    id === undefined
      ? (reply = {
          embeds: await collectionEmbed(contract),
          components: collectionButton,
        })
      : (reply = {
          embeds: await tokenEmbed(contract, id),
        });

    await interaction.editReply(reply);
  } catch (error) {
    await interaction.editReply({
      content: `${error.message}`,
    });
  }
};

export const listingsInteraction = async (
  interaction,
  contract,
  name,
  links
) => {
  await interaction.editReply({
    embeds: await listingsEmbed(contract, name, links),
    components: collectionButton,
  });
};

export const villageInteraction = async (interaction, twitterHandles) => {
  const tweetCharLimit = 280;
  const handlesArray = shuffle(twitterHandles.split(","));
  let temporaryHandle,
    handles = handlesArray[0];

  for (let i = 1; i < handlesArray.length; i++) {
    temporaryHandle = handlesArray[i];

    if (handles.length + temporaryHandle.length + 1 > tweetCharLimit) break;
    handles += " " + temporaryHandle;
  }

  await interaction.editReply({
    content: "```\n" + handles + "\n```",
    components: rerollButton,
  });
};
