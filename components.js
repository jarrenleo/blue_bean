import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from "discord.js";

export const azukiMenu = [
  new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select")
      .setPlaceholder("Select Image")
      .addOptions(
        {
          label: "Azuki",
          description: "Azuki",
          value: "azuki",
        },
        {
          label: "Collector Profile",
          description: "Collector Profile",
          value: "profile",
        },
        {
          label: "Blue Twin Tigers Jacket",
          description: "Azuki in Blue Twin Tigers Jacket",
          value: "blue",
        },
        {
          label: "Red Twin Tigers Jacket",
          description: "Azuki in Red Twin Tigers Jacket",
          value: "red",
        },
        {
          label: "Racing Jacket",
          description: "Azuki in Oracle Red Bull Racing Jacket",
          value: "racing",
        }
      )
  ),
];

export const beanzButton = [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("beanz")
      .setLabel("Beanz")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("selfie")
      .setLabel("Selfie")
      .setStyle(ButtonStyle.Primary)
  ),
];

export const updateButton = [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("update")
      .setLabel("⟳")
      .setStyle(ButtonStyle.Primary)
  ),
];
