import OpenAI from 'openai';
import { config } from 'dotenv';
import { setTimeout } from 'timers/promises';

config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required');
}

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 6; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in ms
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class RateLimitedOpenAI {
  private openai: OpenAI;
  private requestTimes: number[] = [];

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  private async checkRateLimit() {
    const now = Date.now();
    // Remove requests older than our window
    this.requestTimes = this.requestTimes.filter(
      (time) => now - time < RATE_LIMIT_WINDOW
    );

    if (this.requestTimes.length >= RATE_LIMIT_REQUESTS) {
      const oldestRequest = this.requestTimes[0];
      const waitTime = RATE_LIMIT_WINDOW - (now - oldestRequest);
      if (waitTime > 0) {
        console.log(`Rate limit reached, waiting ${waitTime}ms`);
        await setTimeout(waitTime);
      }
    }
    this.requestTimes.push(now);
  }

  async getChatCompletion(
    systemPrompt: string,
    userInput: string,
    maxTokens: number = 500
  ) {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await this.checkRateLimit();

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput },
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        });

        return response.choices[0].message.content;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (error instanceof OpenAI.APIError) {
          if (error.status === 401) throw error; // Invalid API key
          if (error.status === 400) throw error; // Invalid request
        }

        console.warn(`Attempt ${attempt} failed:`, error);

        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY * attempt;
          console.log(`Retrying in ${delay}ms...`);
          await setTimeout(delay);
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  }
}

export const openai = new RateLimitedOpenAI(process.env.OPENAI_API_KEY!);
export const getChatCompletion = openai.getChatCompletion.bind(openai);
