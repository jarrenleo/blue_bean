export const commands = [
  {
    name: "azuki",
    description: "View the Azuki collection",
    options: [
      {
        name: "id",
        description: "Azuki # you wish to find",
        type: 10,
        required: true,
      },
    ],
  },
  {
    name: "beanz",
    description: "View the Beanz collection",
    options: [
      {
        name: "id",
        description: "Beanz # you wish to find",
        type: 10,
        required: true,
      },
    ],
  },
  {
    name: "pair",
    description: "Pair your Azuki and Beanz",
    options: [
      {
        name: "azuki-id",
        description: "Azuki # you wish to pair",
        type: 10,
        required: true,
      },
      {
        name: "beanz-id",
        description: "Beanz # you wish to pair",
        type: 10,
        required: true,
      },
    ],
  },
  {
    name: "find",
    description: "View an NFT collection/token",
    options: [
      {
        name: "query",
        description: "Collection name or contract address you wish to find",
        type: 3,
        required: true,
        autocomplete: true,
      },
      {
        name: "id",
        description: "Token # you wish to find",
        type: 10,
      },
    ],
  },
  {
    name: "profit",
    description: "View your wallet portfolio",
    options: [
      {
        name: "query",
        description: "Collection name or contract address you wish to find",
        type: 3,
        required: true,
        autocomplete: true,
      },
    ],
  },
  {
    name: "wallet",
    description: "Add/Remove wallets from database",
    options: [
      {
        name: "add",
        description: "Wallet address you wish to add",
        type: 3,
      },
      {
        name: "remove",
        description: "Wallet address you wish to remove",
        type: 3,
      },
    ],
  },
  {
    name: "wallet-list",
    description: "View all wallets stored on database",
  },
  {
    name: "village",
    description: "Get randomised twitter handles to tag the village",
  },
];
