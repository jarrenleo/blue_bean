import { Token } from "./token.js";
import { tokenEmbed } from "../../utilities/embeds.js";
import { azukiMenu } from "../../utilities/components.js";

export class Azuki extends Token {
  contract = "0xed5af388653567af2f388e6224dc7c4b3241c544";

  constructor() {
    super();
  }

  async createEmbed(interaction, id) {
    try {
      const data = await this.getTokenData(this.contract, id);
      const embed = tokenEmbed(data);

      await this.sendEmbed(interaction, embed);
    } catch {
      this.sendError(interaction, `Azuki #${id} not found.`);
    }
  }

  async isPairing(interaction) {
    if (interaction.values[0] === "pairing")
      await interaction.showModal(modal("Beanz"));
  }

  getAzukiId(interaction) {
    return interaction.message.embeds[0].data.author.name
      .split(" ")
      .at(-1)
      .slice(1);
  }

  getBeanzId(interaction) {
    return interaction.fields.getTextInputValue("inputId");
  }

  getImageUrl(selection, azukiId, beanzId) {
    const baseUrlJackets = "https://azuki-jackets.s3.us-west-1.amazonaws.com";
    const baseUrlEquip =
      "https://azuki-pairing-images.s3.us-west-1.amazonaws.com";

    const azukiImageUrls = {
      original: `https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${azukiId}.png`,
      pairing: `https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=${azukiId}&beanzId=${beanzId}`,
      blue: `${baseUrlJackets}/blue/${azukiId}.png`,
      red: `${baseUrlJackets}/red/${azukiId}.png`,
      profile: `https://azk.imgix.net/big_azukis/a-${azukiId}.png`,
      dragon: `https://azk.imgix.net/dragon_azukis/ikz1_${azukiId}.png`,
      rbr: `${baseUrlEquip}/equip_rbr/${azukiId}.png`,
      santa: `${baseUrlEquip}/equip_santa/${azukiId}.png`,
    };

    return azukiImageUrls[selection];
  }

  async updateEmbed(interaction, selection, azukiId, beanzId) {
    let updatedEmbed = interaction.message.embeds[0].data;
    updatedEmbed.image.url = this.getImageUrl(selection, azukiId, beanzId);

    await this.sendEmbed(interaction, [updatedEmbed]);
  }

  async sendEmbed(interaction, embed) {
    await interaction.editReply({
      embeds: embed,
      components: azukiMenu,
    });
  }

  async handleInteraction(interaction) {
    if (interaction.type === 2) {
      const id = this.getInput(interaction);
      this.createEmbed(interaction, id);
    }

    if (interaction.type === 3) {
      const id = this.getAzukiId(interaction);
      this.updateEmbed(interaction, interaction.values[0], id);
    }

    if (interaction.type === 5) {
      const azukiId = this.getAzukiId(interaction);
      const beanzId = this.getBeanzId(interaction);

      this.updateEmbed(interaction, "pairing", azukiId, beanzId);
    }
  }
}
