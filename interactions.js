import { getData } from "./fetch.js";
import {
  azukiEmbed,
  beanzEmbed,
  pairEmbed,
  collectionEmbed,
  tokenEmbed,
} from "./embeds.js";
import { azukiButton, beanzButton } from "./buttons.js";

const azukiIdRange = (id) => id >= 0 && id < 10000;

const beanzIdRange = (id) => id >= 0 && id < 19950;

export const azukiInteraction = async (interaction, id) => {
  if (interaction.type === 2) {
    azukiIdRange(id)
      ? await interaction.editReply({
          embeds: await azukiEmbed(id, "azuki"),
          components: azukiButton(),
        })
      : await interaction.editReply({
          content: `Azuki #${id} does not exist in the collection.`,
        });
  }

  if (interaction.type === 3) {
    await interaction.editReply({
      embeds: await azukiEmbed(id, interaction.customId),
      components: azukiButton(),
    });
  }
};

export const beanzInteraction = async (interaction, id) => {
  if (interaction.type === 2) {
    beanzIdRange(id)
      ? await interaction.editReply({
          embeds: await beanzEmbed(id, "beanz"),
          components: beanzButton(),
        })
      : await interaction.editReply({
          content: `Beanz #${id} does not exist in the collection.`,
        });
  }

  if (interaction.type === 3) {
    await interaction.editReply({
      embeds: await beanzEmbed(id, interaction.customId),
      components: beanzButton(),
    });
  }
};

export const pairInteraction = async (interaction, azukiId, beanzId) => {
  azukiIdRange(azukiId) && beanzIdRange(beanzId)
    ? await interaction.editReply({ embeds: await pairEmbed(azukiId, beanzId) })
    : await interaction.editReply({
        content: `Azuki #${azukiId} or Beanz #${beanzId} does not exist in the collection.`,
      });
};

export const findInteraction = async (interaction, data, name, id) => {
  try {
    if (!data)
      [data] = await getData(
        `https://api.reservoir.tools/collections/v5?name=${name}&limit=1`
      );

    const contract = data?.primaryContract;
    if (!contract)
      throw new Error(
        "Collection not found. Please use suggested options that best match your query."
      );

    const embedChoice =
      id === undefined
        ? collectionEmbed(data, contract)
        : tokenEmbed(data, id, contract);

    await interaction.editReply({
      embeds: await embedChoice,
    });
  } catch (error) {
    await interaction.editReply({
      content: `${error.message}`,
    });
  }
};
