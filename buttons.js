import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const azukiButton = [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("azuki")
      .setLabel("Azuki")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("profile")
      .setLabel("Collector Profile")
      .setStyle(ButtonStyle.Primary)
  ),
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("blue")
      .setLabel("Blue Jacket")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("red")
      .setLabel("Red Jacket")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("racer")
      .setLabel("Racer Jacket")
      .setStyle(ButtonStyle.Primary)
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
