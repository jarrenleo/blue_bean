export const commands = [
  {
    name: "find",
    description: "Find a collection/token",
    options: [
      {
        name: "query",
        description: "Collection name or contract address",
        type: 3,
        required: true,
        autocomplete: true,
      },
      {
        name: "id",
        description: "Token ID",
        type: 10,
      },
    ],
  },
  {
    name: "azuki",
    description: "View an Azuki",
    options: [
      {
        name: "id",
        description: "Azuki ID",
        type: 10,
        required: true,
      },
    ],
  },
  {
    name: "beanz",
    description: "View a Beanz",
    options: [
      {
        name: "id",
        description: "Beanz ID",
        type: 10,
        required: true,
      },
    ],
  },
  {
    name: "pair",
    description: "Pair an Azuki and Beanz",
    options: [
      {
        name: "azuki-id",
        description: "Azuki ID",
        type: 10,
        required: true,
      },
      {
        name: "beanz-id",
        description: "Beanz ID",
        type: 10,
        required: true,
      },
    ],
  },
  {
    name: "profit",
    description: "View wallet portfolio",
    options: [
      {
        name: "query",
        description: "Collection name or contract address",
        type: 3,
        required: true,
        autocomplete: true,
      },
    ],
  },
  {
    name: "wallet",
    description: "Add/Remove wallets",
    options: [
      {
        name: "add",
        description: "Add wallet address",
        type: 3,
      },
      {
        name: "remove",
        description: "Remove wallet address",
        type: 3,
      },
    ],
  },
  {
    name: "wallet-list",
    description: "View all wallets stored on database",
  },
];
