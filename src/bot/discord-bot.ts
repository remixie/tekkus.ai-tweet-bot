import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  REST,
  Routes,
} from "discord.js";
import { AIService } from "../services/ai-service";

export class DiscordBot {
  private client: Client;
  private aiService: AIService;
  private readonly mainHandle: string;

  constructor(aiService: AIService) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
    });

    this.aiService = aiService;
    this.mainHandle = process.env.MAIN_TWITTER_HANDLE!;

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on("ready", async () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });

    this.client.on("messageCreate", async (message) => {
      if (message.author.bot) return;

      if (message.mentions.has(this.client.user!)) {
        await this.handleMentionMessage(message);
      }
    });

    this.client.on("error", (error) => {
      console.error("Discord client error:", error);
    });
  }

  private async handleMentionMessage(message: any) {
    try {
      const question = message.content.replace(/<@!?\d+>/g, "").trim();

      if (!question) {
        await message.reply(`Hi! Ask me anything about @${this.mainHandle}`);
        return;
      }

      const response = await this.aiService.generateResponse(question);
      const chunks = this.splitMessage(response);

      await message.reply(chunks[0]);

      for (let i = 1; i < chunks.length; i++) {
        await message.channel.send(chunks[i]);
      }
    } catch (error) {
      console.error("Error handling mention message:", error);
      await message.reply(
        "Sorry, I encountered an error. Please try again later.",
      );
    }
  }

  private splitMessage(message: string): string[] {
    const maxLength = 2000;
    if (message.length <= maxLength) {
      return [message];
    }

    const chunks: string[] = [];
    let currentChunk = "";

    const sentences = message.split(/(?<=[.!?])\s+/);

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length + 1 <= maxLength) {
        currentChunk += (currentChunk ? " " : "") + sentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = sentence;
        } else {
          chunks.push(sentence.substring(0, maxLength));
        }
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  async start() {
    const token = process.env["DISCORD_BOT_TOKEN"];
    if (!token) {
      throw new Error("DISCORD_BOT_TOKEN environment variable is required");
    }

    await this.client.login(token);
  }

  async stop() {
    await this.client.destroy();
  }
}
