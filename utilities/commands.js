const token = (collection) => {
  return {
    name: `${collection.toLowerCase()}`,
    description: `View ${collection} token`,
    options: [
      {
        name: "id",
        description: `${collection} ID`,
        type: 10,
        required: true,
      },
    ],
  };
};

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
  token("Azuki"),
  token("Beanz"),
  token("Elementals"),
];
