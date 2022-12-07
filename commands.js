export const commands = [
  {
    name: "azuki",
    description: "View the Azuki collection",
    options: [
      {
        name: "id",
        description: "Type in the Azuki # you wish to find",
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
        description: "Type in the Beanz # you wish to find",
        type: 10,
        required: true,
      },
    ],
  },
  {
    name: "random",
    description: "View a random Azuki/Beanz from the collection",
  },
  {
    name: "pair",
    description: "Pair your Azuki and Beanz",
    options: [
      {
        name: "azuki-id",
        description: "Type in the Azuki # you wish to pair",
        type: 10,
        required: true,
      },
      {
        name: "beanz-id",
        description: "Type in the Beanz # you wish to pair",
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
        description:
          "Type in the collection name or contract address you wish to find",
        type: 3,
        required: true,
        autocomplete: true,
      },
      {
        name: "id",
        description: "Type in the token # you wish to find",
        type: 10,
        required: false,
        autocomplete: false,
      },
    ],
  },
  {
    name: "village",
    description: "Get randomised twitter handles to tag the village",
  },
];
