import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export const collectionButton = [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("collectionButton")
      .setLabel("Refresh")
      .setStyle(ButtonStyle.Primary)
  ),
];

export const azukiMenu = [
  new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("azukiMenu")
      .setPlaceholder("Select Image")
      .addOptions(
        {
          label: "Original",
          description: "Original Azuki",
          value: "original",
        },
        {
          label: "Pairing",
          description: "Pair Azuki with Beanz",
          value: "pairing",
        },
        {
          label: "Blue Twin Tigers Jacket",
          description: "Azuki with Blue Twin Tigers Jacket",
          value: "blue",
        },
        {
          label: "Red Twin Tigers Jacket",
          description: "Azuki with Red Twin Tigers Jacket",
          value: "red",
        },
        {
          label: "Collector's Profile",
          description: "Azuki Collector's Profile",
          value: "profile",
        },
        {
          label: "Golden Skateboard & Dragon",
          description: "Azuki with Golden Skateboard & Dragon",
          value: "dragon",
        },
        {
          label: "Racing Jacket",
          description: "Azuki with Oracle Red Bull Racing Jacket",
          value: "rbr",
        },
        {
          label: "Santa Hat and Holiday Sweater",
          description: "Azuki with Santa Hat and Holiday Sweater",
          value: "santa",
        }
      )
  ),
];

export const beanzMenu = [
  new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("beanzMenu")
      .setPlaceholder("Select Image")
      .addOptions(
        {
          label: "Original",
          description: "Original Beanz",
          value: "original",
        },
        {
          label: "Pairing",
          description: "Pair Beanz with Azuki",
          value: "pairing",
        },
        {
          label: "Selfie",
          description: "Beanz Selfie",
          value: "selfie",
        },
        {
          label: "Santa Hat and Holiday Sweater",
          description: "Beanz with Santa Hat and Holiday Sweater",
          value: "santa",
        },
        {
          label: "Brown Bear Kigu",
          description: "Beanz with Brown Bear Kigu",
          value: "bear",
        },
        {
          label: "Sally Chick Kigu",
          description: "Beanz with Sally Chick Kigu",
          value: "chick",
        }
      )
  ),
];

export const modal = function () {
  const inputId = new TextInputBuilder()
    .setCustomId("inputId")
    .setLabel("Token ID")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  return new ModalBuilder()
    .setCustomId("modal")
    .setTitle("Pairing")
    .addComponents(new ActionRowBuilder().addComponents(inputId));
};

export const elementalsButton = [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("elementalsButton")
      .setLabel("Refresh Metadata")
      .setStyle(ButtonStyle.Primary)
  ),
];
