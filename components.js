import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from "discord.js";

export const azukiMenu = [
  new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("selectAzuki")
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
          label: "Golden Skateboard & Dragon",
          description: "Azuki with Golden Skateboard & Dragon",
          value: "dragon",
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

export const beanzMenu = [
  new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("selectBeanz")
      .setPlaceholder("Select Image")
      .addOptions(
        {
          label: "Beanz",
          description: "Beanz",
          value: "beanz",
        },
        {
          label: "Beanz (Transparent Background)",
          description: "Beanz (Transparent Background)",
          value: "transparent",
        },
        {
          label: "Selfie",
          description: "Beanz in Selfie Mode",
          value: "selfie",
        },
        {
          label: "Portrait",
          description: "Beanz in Portrait Mode",
          value: "portrait",
        },
        {
          label: "Santa Hat and Holiday Sweater",
          description: "Beanz in Santa Hat and Holiday Sweater",
          value: "beanz_equip_santa",
        },
        {
          label: "Brown Bear Kigu",
          description: "Beanz in Brown Bear Kigu",
          value: "equip_beanz_ipx_brown",
        },
        {
          label: "Sally Chick Kigu",
          description: "Beanz in Sally Chick Kigu",
          value: "equip_beanz_ipx_sally",
        }
      )
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

export const refreshButton = [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("refresh")
      .setLabel("Refresh")
      .setStyle(ButtonStyle.Primary)
  ),
];

export const rerollButton = [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("reroll")
      .setLabel("Reroll")
      .setStyle(ButtonStyle.Primary)
  ),
];
