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

  getId(interaction) {
    return interaction.message.embeds[0].data.author.name
      .split(" ")[1]
      .slice(1);
  }

  getImageUrl(selection, id) {
    const baseUrlJackets = "https://azuki-jackets.s3.us-west-1.amazonaws.com";
    const baseUrlEquip =
      "https://azuki-pairing-images.s3.us-west-1.amazonaws.com";

    const azukiImageUrls = {
      original: `https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${id}.png`,
      blue: `${baseUrlJackets}/blue/${id}.png`,
      red: `${baseUrlJackets}/red/${id}.png`,
      profile: `https://azk.imgix.net/big_azukis/a-${id}.png`,
      dragon: `https://azk.imgix.net/dragon_azukis/ikz1_${id}.png`,
      rbr: `${baseUrlEquip}/equip_rbr/${id}.png`,
      santa: `${baseUrlEquip}/equip_santa/${id}.png`,
    };

    return azukiImageUrls[selection];
  }

  async updateEmbed(interaction, id) {
    let updatedEmbed = interaction.message.embeds[0].data;
    updatedEmbed.image.url = this.getImageUrl(interaction.values[0], id);

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
      const id = this.getId(interaction);
      this.updateEmbed(interaction, id);
    }
  }
}
