export const commands = [
  {
    name: "azuki",
    description: "View the Azuki collection",
    options: [
      {
        name: "id",
        description: "Type in the Azuki # you wish to view",
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
        description: "Type in the Beanz # you wish to view",
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
    name: "find",
    description: "Find an NFT collection",
    options: [
      {
        name: "name",
        description: "Type in the collection name you wish to find",
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
    name: "blue-jacket",
    description: "View Azuki with blue twin tiger jacket",
    options: [
      {
        name: "id",
        description: "Type in the Azuki # you wish to view",
        type: 10,
        required: true,
      },
    ],
  },
  {
    name: "red-jacket",
    description: "View Azuki with red twin tiger jacket",
    options: [
      {
        name: "id",
        description: "Type in the Azuki # you wish to view",
        type: 10,
        required: true,
      },
    ],
  },
  {
    name: "wallpaper",
    description: "View the Azuki wallpaper",
    options: [
      {
        name: "id",
        description: "Type in the Azuki # you wish to view",
        type: 10,
        required: true,
      },
    ],
  },
  {
    name: "selfie",
    description: "View the Beanz selfie mode",
    options: [
      {
        name: "id",
        description: "Type in the Beanz # you wish to view",
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
];
