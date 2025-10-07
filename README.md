# Blue Bean 🫘

An NFT analytical Discord bot built with Discord.js that provides real-time NFT collection and token data through interactive slash commands.

## Features

- **🔍 Universal NFT Search** - Find any NFT collection or token using the `/find` command with intelligent autocomplete
- **🖼️ Dedicated Collection Commands** - Quick access to Azuki, Beanz, and Elementals collections with `/azuki`, `/beanz`, and `/elementals`
- **📊 Real-time Analytics** - Fetches live NFT data from the Reservoir API including floor prices, volume, and market stats
- **⚡ Interactive UI** - Responsive buttons, select menus, and modals for seamless user interaction
- **🎯 Token Lookup** - View detailed information for specific tokens by ID

## Commands

### `/find <query> [id]`

Search for any NFT collection by name or contract address. Optionally specify a token ID to view a specific token.

**Examples:**

- `/find query:Azuki` - View Azuki collection data
- `/find query:Azuki id:1234` - View Azuki token #1234
- `/find query:0x1234...` - Search by contract address

### `/azuki <id>`

View specific Azuki token data.

**Example:**

- `/azuki id:420` - View Azuki token #420

### `/beanz <id>`

View specific Beanz token data.

**Example:**

- `/beanz id:1337` - View Beanz token #1337

### `/elementals <id>`

View specific Elementals token data.

**Example:**

- `/elementals id:100` - View Elementals token #100

## API

This bot uses the [Reservoir API](https://docs.reservoir.tools/) to fetch NFT collection and token data. No API key is required for basic usage.
