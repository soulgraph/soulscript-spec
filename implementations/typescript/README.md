# TypeScript Implementation for Soulscript Prompt Construction

## Overview

This TypeScript implementation generates prompts based on the Soulscript specification using custom prompt templates. It supports generating base prompts and prompts that include relevant memories. Prompt templates are designed in a modular way to enable rapid prototypeing of different prompt structures.

## Directory Structure

- **templates/**: Handlebars prompt templates.
- **types/**: Soulscript type definitions.
- **utils/**: Utility functions for loading data and processing memories.
- **data/**: Agent soul and memory files.
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
    pnpm run boot-soul
    ```