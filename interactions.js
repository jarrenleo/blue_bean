import {
  azukiEmbed,
  beanzEmbed,
  blueEmbed,
  redEmbed,
  pairEmbed,
  findEmbed,
} from "./embeds.js";

const azukiIdRange = function (id) {
  return id >= 0 && id < 10000;
};

const beanzIdRange = function (id) {
  return id >= 0 && id < 19950;
};

export const azukiInteraction = async function (interaction, id) {
  azukiIdRange(id)
    ? interaction.reply({
        embeds: await azukiEmbed(id),
      })
    : interaction.reply({
        content: `Azuki #${id} does not exist in the collection.`,
      });
};

export const beanzInteraction = async function (interaction, id) {
  beanzIdRange(id)
    ? interaction.reply({
        embeds: await beanzEmbed(id),
      })
    : interaction.reply({
        content: `Beanz #${id} does not exist in the collection.`,
      });
};

export const blueInteraction = function (interaction, id) {
  azukiIdRange(id)
    ? interaction.reply({
        embeds: blueEmbed(id),
      })
    : interaction.reply({
        content: `Azuki #${id} does not exist in the collection.`,
      });
};

export const redInteraction = function (interaction, id) {
  azukiIdRange(id)
    ? interaction.reply({
        embeds: redEmbed(id),
      })
    : interaction.reply({
        content: `Azuki #${id} does not exist in the collection.`,
      });
};

export const pairInteraction = function (interaction, azukiId, beanzId) {
  azukiIdRange(azukiId) && beanzIdRange(beanzId)
    ? interaction.reply({
        embeds: pairEmbed(azukiId, beanzId),
      })
    : interaction.reply({
        content: `Azuki #${azukiId} or Beanz #${beanzId} does not exist in the collection.`,
      });
};

export const findInteraction = async function (interaction, name) {
  interaction.reply({
    embeds: await findEmbed(name),
  });
};
