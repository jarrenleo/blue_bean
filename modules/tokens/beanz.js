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

  getBeanzId(interaction) {
    return interaction.message.embeds[0].data.author.name
      .split(" ")[1]
      .slice(1);
  }

  getAzukiId(interaction) {
    return interaction.fields.getTextInputValue("inputId");
  }

  getImageUrl(selection, beanzId, azukiId) {
    const baseUrl = "https://azkimg.imgix.net";
    const baseUrlEquip =
      "https://azuki-pairing-images.s3.us-west-1.amazonaws.com";

    const beanzImageUrls = {
      original: `${baseUrl}/images/final-${beanzId}.png`,
      pairing: `https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=${azukiId}&beanzId=${beanzId}`,
      selfie: `${baseUrl}/images_squareface/final-${beanzId}.png`,
      santa: `${baseUrlEquip}/beanz_equip_santa/${beanzId}.png`,
      bear: `${baseUrlEquip}/equip_beanz_ipx_brown/${beanzId}.png`,
      chick: `${baseUrlEquip}/equip_beanz_ipx_sally/${beanzId}.png`,
    };

    return beanzImageUrls[selection];
  }

  async updateEmbed(interaction, selection, beanzId, azukiId) {
    let updatedEmbed = interaction.message.embeds[0].data;
    updatedEmbed.image.url = this.getImageUrl(selection, beanzId, azukiId);

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
      const id = this.getBeanzId(interaction);
      this.updateEmbed(interaction, interaction.values[0], id);
    }

    if (interaction.type === 5) {
      const beanzId = this.getBeanzId(interaction);
      const azukiId = this.getAzukiId(interaction);

      this.updateEmbed(interaction, "pairing", beanzId, azukiId);
    }
  }
}
