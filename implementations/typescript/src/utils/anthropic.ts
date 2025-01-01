import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';
import { setTimeout } from 'timers/promises';

config();

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is required');
}

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 3;
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

class RateLimitedAnthropic {
  private anthropic: Anthropic;
  private requestTimes: number[] = [];

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  private async checkRateLimit() {
    const now = Date.now();
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

        const message = await this.anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: maxTokens,
          messages: [
            {
              role: 'user',
              content: `${systemPrompt}\n\nUser input: ${userInput}`,
            },
          ],
        });

        return message.content[0].text;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (error instanceof Anthropic.APIError) {
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

export const anthropic = new RateLimitedAnthropic(
  process.env.ANTHROPIC_API_KEY!
);
export const getChatCompletion = anthropic.getChatCompletion.bind(anthropic);
