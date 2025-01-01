# TypeScript Implementation for Soulscript Prompt Construction

## Overview

This TypeScript implementation generates prompts based on the Soulscript specification. It supports generating base prompts and prompts that include relevant memories.

## Directory Structure

- **soulscript/types**: Soulscript and MemoryGraph zod schemas.
- **soulscript/models**: Soulscript and MemoryGraph interfaces.
- **utils/**: Utility functions for loading data and processing memories.
- **data/**: Agent soul and memory files.
- **prompt.ts**: Basic prompt formatting.
- **index.ts**: Entrypoint for creating the agent's personality system prompt associated with the soulscript files in `data/`.

## Setup

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Configure Environment Variables**

   Create a `.env` file and add necessary variables as shown in `.env.example`

3. **Run Soul Prompt Creation**
   ```bash
   pnpm run soul
   ```

## Terminal Workbench

The terminal workbench allows you to test different LLM providers (OpenAI, Anthropic, Ollama) with your soulscript configuration.

### Prerequisites

1. **API Keys**

   ```bash
   # Create .env file
   cp .env.example .env

   # Add your API keys
   OPENAI_API_KEY=sk-your-key-here
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   OLLAMA_HOST=http://localhost:11434  # Optional, defaults to this
   ```

2. **For Ollama Users**
   - [Install Ollama](https://ollama.ai/download)
   - Pull a model:
   ```bash
   ollama pull mistral    # or another model like llama2
   ```

### Usage

1. **Start the Workbench**

   ```bash
   npx tsx src/cli.ts
   ```

2. **Available Commands**

   - `!o <message>` - Use OpenAI (GPT-4)
   - `!a <message>` - Use Anthropic (Claude)
   - `!l <message>` - Use Ollama (Local LLM)
   - `exit` - Quit the program

3. **Examples**
   ```bash
   !o Tell me a joke
   !a What's the meaning of life?
   !l Explain quantum computing
   ```

### Troubleshooting

- **Ollama Connection Issues**

  - Ensure Ollama is running: `ollama serve`
  - Verify model is downloaded: `ollama list`
  - Check OLLAMA_HOST in .env matches your setup

- **API Key Issues**

  - Verify keys are properly set in .env
  - No quotes needed around API keys
  - Restart the workbench after changing .env

- **Model Not Found**
  - For Ollama: Run `ollama pull <model_name>`
  - For OpenAI/Anthropic: Check API key permissions
