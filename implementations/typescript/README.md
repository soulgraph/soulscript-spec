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