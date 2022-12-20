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
          value: "rbr",
        },
        {
          label: "Santa Hat and Holiday Sweater",
          description: "Azuki in Santa Hat and Holiday Sweater",
          value: "santa",
        },
        {
          label: "Ambush Hoodie (White)",
          description: "Azuki in White Ambush Hoodie",
          value: "white",
        },
        {
          label: "Ambush Hoodie (Black)",
          description: "Azuki in Black Ambush Hoodie",
          value: "black",
        },
        {
          label: "Ambush Hoodie (Blue)",
          description: "Azuki in Black Ambush Hoodie with Blue Traits",
          value: "bblue",
        },
        {
          label: "Ambush Hoodie (Red)",
          description: "Azuki in Black Ambush Hoodie with Red Traits",
          value: "bred",
        },
        {
          label: "Ambush Hoodie (Water)",
          description: "Azuki in Black Ambush Hoodie with Water Traits",
          value: "bwater",
        },
        {
          label: "Ambush Hoodie (Fire)",
          description: "Azuki in Black Ambush Hoodie with Fire Traits",
          value: "bfire",
        },
        {
          label: "Ambush Hoodie (Earth)",
          description: "Azuki in Black Ambush Hoodie with Earth Traits",
          value: "bearth",
        },
        {
          label: "Ambush Hoodie (Electric)",
          description: "Azuki in Black Ambush Hoodie with Electric Traits",
          value: "belectric",
        },
        {
          label: "Ambush Hoodie (Gold)",
          description: "Azuki in Black Ambush Hoodie with Gold Traits",
          value: "gold",
        },
        {
          label: "Ambush Hoodie (Spirit)",
          description: "Azuki in Black Ambush Hoodie with Spirit Traits",
          value: "spirit",
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
      .setCustomId("transparent")
      .setLabel("Transparent")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("selfie")
      .setLabel("Selfie")
      .setStyle(ButtonStyle.Primary)
  ),
];

export const collectionButton = [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("collection")
      .setLabel("Collection")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("listings")
      .setLabel("Listings")
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
