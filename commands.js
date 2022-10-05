export const commands = [
  {
    name: "azuki",
    description: "View Azuki Collection",
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
    description: "View Beanz Collection",
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
    name: "blue",
    description: "Equip Azuki with blue twin tiger jacket",
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
    name: "red",
    description: "Equip Azuki with red twin tiger jacket",
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
