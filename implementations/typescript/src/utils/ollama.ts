import { setTimeout } from 'timers/promises';
import { config } from 'dotenv';

config();

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 6;
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Default to localhost if not specified
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class RateLimitedOllama {
  private requestTimes: number[] = [];
  private baseUrl: string;
  private model: string | null = null;

  constructor(host: string = OLLAMA_HOST) {
    this.baseUrl = host;
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

  private async initializeModel() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();

      // Filter for non-embedding models
      const chatModels = data.models.filter(
        (m) => !m.name.includes('embed') && !m.name.includes('nomic')
      );

      // Prefer these models in order
      const preferredModels = ['mistral', 'llama2'];

      // Try to find a preferred model
      for (const preferred of preferredModels) {
        const model = chatModels.find((m) =>
          m.name.toLowerCase().includes(preferred)
        );
        if (model) {
          this.model = model.name;
          return;
        }
      }

      // Fallback to first available chat model
      if (chatModels.length > 0) {
        this.model = chatModels[0].name;
      } else {
        throw new Error('No suitable chat models found');
      }
    } catch (error) {
      console.error('Error initializing Ollama model:', error);
      throw error;
    }
  }

  private async ensureModelInitialized() {
    if (!this.model) {
      await this.initializeModel();
    }
  }

  async getChatCompletion(
    systemPrompt: string,
    userInput: string,
    maxTokens: number = 500
  ) {
    await this.ensureModelInitialized();
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await this.checkRateLimit();

        const messages: Message[] = [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userInput,
          },
        ];

        const response = await fetch(`${this.baseUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            stream: false,
            options: {
              num_predict: maxTokens,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, body: ${errorText}`
          );
        }

        const data = await response.json();
        return data.message.content;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (error instanceof Error) {
          if (error.message.includes('model not found')) throw error;
          if (error.message.includes('invalid request')) throw error;
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

export const ollama = new RateLimitedOllama();
export const getChatCompletion = ollama.getChatCompletion.bind(ollama);
