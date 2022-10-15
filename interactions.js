import {
  azukiEmbed,
  beanzEmbed,
  findEmbed,
  pairEmbed,
  etcEmbed,
} from "./embeds.js";

const azukiIdRange = function (id) {
  return id >= 0 && id < 10000;
};

const beanzIdRange = function (id) {
  return id >= 0 && id < 19950;
};

export const azukiInteraction = async function (interaction, id) {
  azukiIdRange(id)
    ? await interaction.editReply({
        embeds: await azukiEmbed(id),
      })
    : await interaction.editReply({
        content: `Azuki #${id} does not exist in the collection.`,
      });
};

export const beanzInteraction = async function (interaction, id) {
  beanzIdRange(id)
    ? await interaction.editReply({
        embeds: await beanzEmbed(id),
      })
    : await interaction.editReply({
        content: `Beanz #${id} does not exist in the collection.`,
      });
};

export const findInteraction = async function (interaction, data, name, id) {
  try {
    await interaction.editReply({
      embeds: await findEmbed(data, name, id),
    });
  } catch (error) {
    await interaction.editReply({
      content: `${error.message}`,
    });
  }
};

export const pairInteraction = async function (interaction, azukiId, beanzId) {
  azukiIdRange(azukiId) && beanzIdRange(beanzId)
    ? await interaction.editReply({
        embeds: await pairEmbed(azukiId, beanzId),
      })
    : await interaction.editReply({
        content: `Azuki #${azukiId} or Beanz #${beanzId} does not exist in the collection.`,
      });
};

export const blueInteraction = async function (interaction, id) {
  azukiIdRange(id)
    ? await interaction.editReply({
        embeds: await etcEmbed(
          id,
          `https://azuki-jackets.s3.us-west-1.amazonaws.com/blue/${id}.png`
        ),
      })
    : await interaction.editReply({
        content: `Azuki #${id} does not exist in the collection.`,
      });
};

export const redInteraction = async function (interaction, id) {
  azukiIdRange(id)
    ? await interaction.editReply({
        embeds: await etcEmbed(
          id,
          `https://azuki-jackets.s3.us-west-1.amazonaws.com/red/${id}.png`
        ),
      })
    : await interaction.editReply({
        content: `Azuki #${id} does not exist in the collection.`,
      });
};

export const wallpaperInteraction = async function (interaction, id) {
  azukiIdRange(id)
    ? await interaction.editReply({
        embeds: await etcEmbed(
          id,
          `https://azk.imgix.net/big_azukis/a-${id}.png`
        ),
      })
    : await interaction.editReply({
        content: `Azuki #${id} does not exist in the collection.`,
      });
};
