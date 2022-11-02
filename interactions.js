import { getData } from "./fetch.js";
import { collectionEmbed, othersEmbed, tokenEmbed } from "./embeds.js";

const azukiIdRange = function (id) {
  return id >= 0 && id < 10000;
};

const beanzIdRange = function (id) {
  return id >= 0 && id < 19950;
};

export const mainInteraction = async function (interaction, data, name, id) {
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
        : tokenEmbed(interaction.commandName, data, id, contract);

    await interaction.editReply({
      embeds: await embedChoice,
    });
  } catch (error) {
    await interaction.editReply({
      content: `${error.message}`,
    });
  }
};

export const othersInteraction = async function (
  interaction,
  azukiId,
  beanzId
) {
  let range, othersReply;

  if (interaction.commandName === "selfie") {
    range = beanzIdRange(beanzId);
    othersReply = `Beanz #${beanzId} does not exist in the collection.`;
  } else if (interaction.commandName === "pair") {
    range = azukiIdRange(azukiId) && beanzIdRange(beanzId);
    othersReply = `Azuki #${azukiId} or Beanz #${beanzId} does not exist in the collection.`;
  } else {
    range = azukiIdRange(azukiId);
    othersReply = `Azuki #${azukiId} does not exist in the collection.`;
  }

  range
    ? await interaction.editReply({
        embeds: await othersEmbed(interaction.commandName, azukiId, beanzId),
      })
    : await interaction.editReply({
        content: othersReply,
      });
};
