# Tekkusai AI Discord Bot

A Discord AI bot that uses @tekkusai's complete Twitter history to answer questions about AI, technology, products, and related topics with deep contextual knowledge.

## Features

- **JSON-Based Tweet Data**: Loads complete Twitter history from JSON export file
- **Smart Search System**: Node.js-based grep search through entire tweet history
- **Discord Mention Integration**: Responds to @mentions (no slash commands)
- **Deep Historical Context**: Includes retweets from @KurosunCo and @GLSSWRKSGG
- **AI Responses**: Uses OpenAI models to generate accurate, data-driven responses
- **REST API**: Fastify server with tweet search and management endpoints

## Setup

### Prerequisites

- Node.js 18 or higher (managed by mise)
- Discord Bot Token
- OpenAI API Key
- Twitter JSON export file (`twitter-UserTweets-1752162517013.json`)

### Installation

1. Install tools using mise:
```bash
mise install
```

2. Install dependencies:
```bash
pnpm install
```

3. Place your Twitter JSON export file in the project root:
```bash
# File should be named: twitter-UserTweets-1752162517013.json
```

4. Copy the environment file and configure it:
```bash
cp .env.example .env
```

5. Edit `.env` with your credentials:
```
DISCORD_BOT_TOKEN=your_discord_bot_token_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

### Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application and bot
3. Copy the bot token to your `.env` file
4. **IMPORTANT**: Enable "Message Content Intent" in bot settings (required for @mentions)
5. Invite the bot to your server with appropriate permissions (Send Messages, Read Messages)

### Running the Bot

Development mode:
```bash
pnpm run dev
```

Production mode:
```bash
pnpm run build
pnpm start
```

## Usage

### Discord Interaction

Simply @mention the bot with your question:
```
@BotName when was ninja released?
@BotName what does tekkusai think about AI?
@BotName tell me about the samurai mousepad
```

The bot will search through @tekkusai's complete Twitter history and provide accurate, concise answers with sources.

### API Endpoints

- `GET /health` - Health check
- `GET /tweets` - Get all loaded tweets with stats
- `GET /tweets/json` - Get tweets in JSON format with metadata
- `GET /tweets/search/:keyword` - Search tweets by keyword
- `POST /refresh-tweets` - Manually refresh tweets from JSON file

## Architecture

- **src/index.ts** - Main server entry point and API routes
- **src/bot/discord-bot.ts** - Discord bot logic with @mention handling
- **src/services/ai-service.ts** - OpenAI integration, JSON loading, and smart search system

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_BOT_TOKEN` | Discord bot token | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment | No (default: development) |

## Development

### Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run typecheck` - Run TypeScript type checking

### Project Structure

```
src/
├── bot/
│   └── discord-bot.ts        # Discord @mention handling
├── services/
│   └── ai-service.ts         # OpenAI + JSON loading + search
└── index.ts                  # Server + API routes
twitter-UserTweets-*.json     # Twitter export data
```

## How It Works

- **Complete History**: Loads entire Twitter history from JSON export file
- **Smart Search**: Uses Node.js grep to search through ALL tweets, not just recent ones
- **Relevant Context**: Finds up to 200 most relevant tweets for each query
- **Important Retweets**: Includes retweets from @KurosunCo and @GLSSWRKSGG business accounts
- **Concise Responses**: Provides brief, direct answers with exact dates when possible
- **Source Attribution**: All responses include "Sources: [URLs]" for verification
- **Mention-Based**: Responds to @mentions, no slash commands needed
- **Auto-chunking**: Long responses are automatically split for Discord's 2000 character limit

## License

MIT
## Deploying to Discloud

You can deploy this bot to [Discloud](https://discloudbot.com/) for easy hosting.

### Steps

1. **Import the repository on Discloud**  
   - Go to the Discloud dashboard and select "Import from GitHub".
   - Authorize access and select this repository.

2. **Environment Variables**  
   - On Discloud, set the following environment variables in the dashboard:
     - `DISCORD_BOT_TOKEN`
     - `OPENAI_API_KEY`
     - `PORT` (e.g., 3000)
     - `NODE_ENV` (optional, e.g., `production`)

3. **Build & Start**  
   - Discloud will automatically run `pnpm install` and use the `start` script (`node dist/index.js`).
   - Ensure you have built the project (`pnpm run build`) before deploying, or set up a `postinstall` script to build automatically.

4. **.env File**  
   - Do not upload your `.env` file; use the Discloud dashboard to set secrets.

For more details, see the [Discloud documentation](https://docs.discloudbot.com/).