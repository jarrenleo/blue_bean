export const collectionEmbed = (data) => {
  const [
    name,
    verification,
    image,
    supply,
    listed,
    royalty,
    owners,
    floor,
    bid,
    volume,
    contractLink,
    socialLinks,
    marketplaceLinks,
  ] = data;

  return [
    {
      color: 0x0267bc,
      title: `${name} ${verification}`,
      thumbnail: {
        url: image,
      },
      timestamp: new Date(Date.now()).toISOString(),
      fields: [
        {
          name: "Supply",
          value: supply,
          inline: true,
        },
        {
          name: "Listed",
          value: listed,
          inline: true,
        },
        {
          name: "Royalty",
          value: royalty,
          inline: true,
        },
        {
          name: "Owners",
          value: owners,
          inline: true,
        },
        {
          name: "Floor Price",
          value: floor,
          inline: true,
        },
        {
          name: "Top Bid",
          value: bid,
          inline: true,
        },
        {
          name: "Total Volume",
          value: volume,
          inline: false,
        },
        {
          name: "Contract Address",
          value: contractLink,
          inline: false,
        },
        {
          name: "Social Links",
          value: socialLinks,
          inline: false,
        },
        {
          name: "Marketplace Links",
          value: marketplaceLinks,
          inline: false,
        },
      ],
    },
  ];
};

export const tokenEmbed = (data) => {
  const [icon, name, isFlagged, rarity, attribute, link, image, statistic] =
    data;

  return [
    {
      color: 0x0267bc,
      author: {
        name: `${name} ${isFlagged}`,
        icon_url: icon,
      },
      description: rarity,
      fields: [...attribute, ...link],
      image: {
        url: image,
      },
      footer: {
        text: statistic,
      },
    },
  ];
};
