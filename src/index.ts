import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from 'dotenv';
import { DiscordBot } from './bot/discord-bot';
import { AIService } from './services/ai-service';

config();

const fastify = Fastify({
  logger: true
});

let bot: DiscordBot;
let aiService: AIService;

async function startServer() {
  try {
    await fastify.register(cors, {
      origin: true
    });

    fastify.get('/health', async () => {
      return { status: 'OK', timestamp: new Date().toISOString() };
    });

    fastify.get('/tweets', async () => {
      const tweets = await aiService.getAllTweets();
      const stats = await aiService.getTweetStats();
      return { tweets, count: tweets.length, stats };
    });

    // Add endpoint to serve JSON file for AI access
    fastify.get('/tweets/json', async () => {
      const tweets = await aiService.getAllTweets();
      return { 
        source: 'twitter-export-json', 
        tweets, 
        count: tweets.length,
        stats: await aiService.getTweetStats()
      };
    });

    // Add endpoint to get tweets by keyword
    fastify.get('/tweets/search/:keyword', async (request) => {
      const { keyword } = request.params as { keyword: string };
      const tweets = await aiService.getTweetsByKeyword(keyword);
      return { tweets, count: tweets.length, keyword };
    });

    fastify.post('/refresh-tweets', async (request, reply) => {
      try {
        console.log('🔄 Manual tweet refresh triggered via API (loading from JSON)');
        await aiService.clearMemory(); // Clear cache to force reload
        const tweets = await aiService.getAllTweets(); // This will trigger JSON loading
        console.log('✅ Manual refresh complete');
        return { message: 'Tweets refreshed from JSON file successfully', count: tweets.length };
      } catch (error) {
        console.error('❌ Manual refresh failed:', error);
        return reply.status(500).send({ error: 'Failed to refresh tweets from JSON' });
      }
    });

    aiService = new AIService();
    
    bot = new DiscordBot(aiService);
    await bot.start();

    console.log('🔄 Loading tweets from JSON file...');
    const tweets = await aiService.getAllTweets(); // This will trigger JSON loading
    console.log('✅ Initial tweet loading complete from JSON file');

    const port = process.env.PORT || 3000;
    await fastify.listen({ port: Number(port), host: '0.0.0.0' });
    
    console.log(`Server running on port ${port}`);
    console.log('Discord bot is ready!');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();