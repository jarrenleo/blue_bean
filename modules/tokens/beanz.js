import { Token } from "./token.js";
import { tokenEmbed } from "../../utilities/embeds.js";
import { beanzMenu } from "../../utilities/components.js";

export class Beanz extends Token {
  contract = "0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949";

  constructor() {
    super();
  }

  async createEmbed(interaction, id) {
    try {
      const data = await this.getTokenData(this.contract, id);
      const embed = tokenEmbed(data);

      await this.sendEmbed(interaction, embed);
    } catch {
      this.sendError(interaction, `Beanz #${id} not found.`);
    }
  }

  getId(interaction) {
    return interaction.message.embeds[0].data.author.name
      .split(" ")[1]
      .slice(1);
  }

  getImageUrl(selection, id) {
    const baseUrl = "https://azkimg.imgix.net";
    const baseUrlEquip =
      "https://azuki-pairing-images.s3.us-west-1.amazonaws.com";

    const beanzImageUrls = {
      original: `${baseUrl}/images/final-${id}.png`,
      no_background: `${baseUrl}/images_no_bg/final-${id}.png`,
      selfie: `${baseUrl}/images_squareface/final-${id}.png`,
      santa: `${baseUrlEquip}/beanz_equip_santa/${id}.png`,
      bear: `${baseUrlEquip}/equip_beanz_ipx_brown/${id}.png`,
      chick: `${baseUrlEquip}/equip_beanz_ipx_sally/${id}.png`,
    };

    return beanzImageUrls[selection];
  }

  async updateEmbed(interaction, id) {
    let updatedEmbed = interaction.message.embeds[0].data;
    updatedEmbed.image.url = this.getImageUrl(interaction.values[0], id);

    await this.sendEmbed(interaction, [updatedEmbed]);
  }

  async sendEmbed(interaction, embed) {
    await interaction.editReply({
      embeds: embed,
      components: beanzMenu,
    });
  }

  async handleInteraction(interaction) {
    if (interaction.type === 2) {
      const id = this.getInput(interaction);
      this.createEmbed(interaction, id);
    }

    if (interaction.type === 3) {
      const id = this.getId(interaction);
      this.updateEmbed(interaction, id);
    }
  }
}
