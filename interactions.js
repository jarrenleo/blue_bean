import {
  azukiEmbed,
  beanzEmbed,
  pairEmbed,
  collectionEmbed,
  tokenEmbed,
  listingsEmbed,
  profitEmbed,
} from "./embeds.js";
import {
  azukiMenu,
  beanzMenu,
  collectionButton,
  refreshButton,
  rerollButton,
} from "./components.js";
import { hasDBRecord, shuffle } from "./helpers.js";

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

export const findInteraction = async (interaction, contract, id, db) => {
  try {
    if (!contract)
      throw new Error(
        "Collection not found. Please use autocomplete to best match your query."
      );

    switch (interaction.commandName || interaction.customId) {
      case "find":
      case "collection":
        id === undefined
          ? interaction.editReply({
              embeds: await collectionEmbed(contract),
              components: collectionButton,
            })
          : interaction.editReply({
              embeds: await tokenEmbed(contract, id),
            });
        break;
      case "profit":
        await interaction.editReply({
          embeds: await profitEmbed(contract, interaction.user.id, db),
        });
    }
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

export const walletInteraction = async (interaction, db) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const addressInput = interaction.options._hoistedOptions[0].value.trim();
    const subCommandName = interaction.options._hoistedOptions[0].name;
    const userId = interaction.user.id;

    if (addressInput.length !== 42)
      throw new Error("Invalid wallet/contract address ❌");

    const isResponseAcknowledged = (response) => {
      if (response.acknowledged)
        interaction.editReply({
          content: `Wallet address updated ✅`,
        });
      else
        throw new Error(
          `Unable to update wallet address, please try again later ❌`
        );
    };

    switch (subCommandName) {
      case "add":
        const hasAddRecord = await hasDBRecord(db, { userId: userId });

        if (!hasAddRecord) {
          const response = await db.insertOne({
            userId: userId,
            wallets: [addressInput],
          });
          isResponseAcknowledged(response);
          break;
        }

        if (hasAddRecord.wallets.includes(addressInput))
          throw new Error("Wallet address has previously been added ❌");

        const addUpdateResponse = await db.updateOne(
          { userId: userId },
          { $push: { wallets: addressInput } }
        );
        isResponseAcknowledged(addUpdateResponse);
        break;
      case "remove":
        const hasRemoveRecord = await hasDBRecord(db, {
          userId: userId,
          wallets: addressInput,
        });

        if (!hasRemoveRecord)
          throw new Error("Wallet address does not exist ❌");

        const removeUpdateResponse = await db.updateOne(
          { userId: userId },
          { $pull: { wallets: addressInput } }
        );
        isResponseAcknowledged(removeUpdateResponse);
    }
  } catch (error) {
    await interaction.editReply({
      content: `${error.message}`,
    });
  }
};

export const walletListInteraction = async (interaction, db) => {
  try {
    await interaction.deferReply({ ephemeral: true });

    const hasWalletListRecord = await hasDBRecord(db, {
      userId: interaction.user.id,
    });

    if (!hasWalletListRecord) throw new Error("Wallet list not found ❌");

    const walletList = hasWalletListRecord.wallets.join("\n- ");
    await interaction.editReply({
      content: `**Wallet List**\n- ${walletList}`,
    });
  } catch (error) {
    await interaction.editReply({
      content: `${error.message}`,
    });
  }
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
