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
];
