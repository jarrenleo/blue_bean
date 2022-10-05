import { getData, getTraitFields } from "./fetch.js";

export const azukiEmbed = async function (id) {
  try {
    const data = await getData(
      `https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/${id}`
    );
    const traitFields = getTraitFields(data);

    return [
      {
        color: 0xc13540,
        author: {
          name: `${data.name}`,
          icon_url:
            "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1920",
        },
        fields: [
          ...traitFields,
          {
            name: "Links",
            value: `[OpenSea](https://opensea.io/assets/ethereum/0xed5af388653567af2f388e6224dc7c4b3241c544/${id}) | [LooksRare](https://looksrare.org/collections/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${id}) | [X2Y2](https://x2y2.io/eth/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${id}) | [SudoSwap](https://sudoswap.xyz/#/item/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${id}) | [Gem](https://www.gem.xyz/asset/0xed5af388653567af2f388e6224dc7c4b3241c544/${id})`,
          },
        ],
        image: {
          url: `${data.image}`,
        },
      },
    ];
  } catch (error) {
    console.log(error.message);
  }
};

export const beanzEmbed = async function (id) {
  try {
    const data = await getData(
      `https://ikzttp.mypinata.cloud/ipfs/QmPZKyuRw4nQTD6S6R5HaNAXwoQVMj8YydDmad3rC985WZ/${id}`
    );
    const traitFields = await getTraitFields(data);

    return [
      {
        color: 0xc13540,
        author: {
          name: `Beanz #${id}`,
          icon_url:
            "https://i.seadn.io/gae/_R4fuC4QGYd14-KwX2bD1wf-AWjDF2VMabfqWFJhIgiN2FnAUpnD5PLdJORrhQ8gly7KcjhQZZpuzYVPF7CDSzsqmDh97z84j2On?auto=format&w=1920",
        },
        fields: [
          ...traitFields,
          {
            name: "Links",
            value: `[OpenSea](https://opensea.io/assets/ethereum/0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949/${id}) | [LooksRare](https://looksrare.org/collections/0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949/${id}) | [X2Y2](https://x2y2.io/eth/0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949/${id}) | [SudoSwap](https://sudoswap.xyz/#/item/0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949/${id}) | [Gem](https://www.gem.xyz/asset/0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949/${id})`,
          },
        ],
        image: {
          url: `${data.image}`,
        },
      },
    ];
  } catch (error) {
    console.log(error.message);
  }
};

export const blueEmbed = function (id) {
  return [
    {
      color: 0xc13540,
      author: {
        name: `Azuki #${id} in Blue Twin Tiger Jacket`,
        icon_url:
          "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1920",
      },
      fields: [
        {
          name: "Links",
          value: `[OpenSea](https://opensea.io/assets/ethereum/0xed5af388653567af2f388e6224dc7c4b3241c544/${id}) | [LooksRare](https://looksrare.org/collections/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${id}) | [X2Y2](https://x2y2.io/eth/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${id}) | [SudoSwap](https://sudoswap.xyz/#/item/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${id}) | [Gem](https://www.gem.xyz/asset/0xed5af388653567af2f388e6224dc7c4b3241c544/${id})`,
        },
      ],
      image: {
        url: `https://azuki-jackets.s3.us-west-1.amazonaws.com/blue/${id}.png`,
      },
    },
  ];
};

export const redEmbed = function (id) {
  return [
    {
      color: 0xc13540,
      author: {
        name: `Azuki #${id} in Red Twin Tiger Jacket`,
        icon_url:
          "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1920",
      },
      fields: [
        {
          name: "Links",
          value: `[OpenSea](https://opensea.io/assets/ethereum/0xed5af388653567af2f388e6224dc7c4b3241c544/${id}) | [LooksRare](https://looksrare.org/collections/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${id}) | [X2Y2](https://x2y2.io/eth/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${id}) | [SudoSwap](https://sudoswap.xyz/#/item/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${id}) | [Gem](https://www.gem.xyz/asset/0xed5af388653567af2f388e6224dc7c4b3241c544/${id})`,
        },
      ],
      image: {
        url: `https://azuki-jackets.s3.us-west-1.amazonaws.com/red/${id}.png`,
      },
    },
  ];
};

export const pairEmbed = function (azukiId, beanzId) {
  return [
    {
      color: 0xc13540,
      author: {
        name: `Azuki #${azukiId} | Beanz #${beanzId}`,
        icon_url:
          "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1920",
      },
      fields: [
        {
          name: "Links to Azuki",
          value: `[OpenSea](https://opensea.io/assets/ethereum/0xed5af388653567af2f388e6224dc7c4b3241c544/${azukiId}) | [LooksRare](https://looksrare.org/collections/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${azukiId}) | [X2Y2](https://x2y2.io/eth/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${azukiId}) | [SudoSwap](https://sudoswap.xyz/#/item/0xED5AF388653567Af2F388E6224dC7C4b3241C544/${azukiId}) | [Gem](https://www.gem.xyz/asset/0xed5af388653567af2f388e6224dc7c4b3241c544/${azukiId})`,
        },
        {
          name: "Links to Beanz",
          value: `[OpenSea](https://opensea.io/assets/ethereum/0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949/${beanzId}) | [LooksRare](https://looksrare.org/collections/0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949/${beanzId}) | [X2Y2](https://x2y2.io/eth/0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949/${beanzId}) | [SudoSwap](https://sudoswap.xyz/#/item/0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949/${beanzId}) | [Gem](https://www.gem.xyz/asset/0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949/${beanzId})`,
        },
      ],
      image: {
        url: `https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=${azukiId}&beanzId=${beanzId}`,
      },
    },
  ];
};
