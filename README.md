<div align="center">

<img src="img/logo-no-text.png" height="200px" />

# soulscript

[![license MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE) [![docs gitbook](https://img.shields.io/badge/docs-gitbook-green)](https://soulgraph.gitbook.io/soulgraph-docs) [![Discord](https://img.shields.io/discord/1319570689350696970?label=&labelColor=6A7EC2&logo=discord&logoColor=ffffff&color=7389D8)](https://discord.gg/TpavQZnT) [![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/soulgra_ph)](https://twitter.com/soulgra_ph)

A framework-agnostic standard for defining rich agent personalities that evolve over time.

<a href="https://soulgra.ph">
  <img src="img/1500x500.jpg" >
</a>
</div>

## What this repo is, and isn't

This repo contains the WIP spec for soulscript. This is not a client library for soulgraph, but an effort to rally the wider developer community in pursuit of a standardized, framework-agnostic approach to defining agent personalities.

> [!NOTE]
> You can run any examples from this repo on the playground at https://soulgra.ph

## Navigating the repo

- `spec/SPEC.md` - core soulscript spec
- `examples/` - original & community-sourced examples
- `implementations/` - basic example implementations (basic example in spec, standalone coming soon)

A good place to start would be the examples below.

| agent           | files                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| marcus_aurelius | [`agent.soul`](examples/marcus_aurelius/agent.soul) · [`memories.json`](examples/marcus_aurelius/memories.json) |
| luce            | [`agent.soul`](examples/luce/agent.soul) · [`memories.json`](examples/luce/memories.json)                       |
| irina           | [`agent.soul`](examples/irina/agent.soul) · [`memories.json`](examples/irina/memories.json)                     |
| fartcoin-maxi   | [`agent.soul`](examples/fartcoin-maxi/agent.soul) · [`memories.json`](examples/fartcoin-maxi/memories.json)     |

For a full index of examples with playground links, see [SOULS_INDEX.md](examples/SOUL_INDEX.md).

## Why does this need to exist?

There's plenty of tooling for developers to build the logic layer, or the "hard skills" of their agents. There's none to give them "soft-skills". With soulscript, our goal is to give developers a standardized way to:

- create agents with distinct personalities that persist across platforms

- define how agents think, react, and evolve through interactions

- share and reuse personality specs

- build tools and libraries around a common standard

- share best practices that can emerge from shared implementations

<img src="img/agent_anatomy.jpg"/>

## A real-world practical example: personality filters

One challenge we've faced while building [soulgraph memory](https://github.com/soulgra-ph/soulgraph-memory) is observing user<>agent interactions through the filter of a given agent's personality. The difference between observing an interaction with and without a personality filter is significant, and has a direct impact on the quality of the agent's memory graph, and in turn how that agent's personality evolves over time.

With filter:

> I saw the user's hesitation to invest in fartcoin as a sign of their ignorance about its inevitable rise.

Without filter:

> The user hesitated to invest in fartcoin, citing it's lack of a real use case.

<img src="img/memory.jpg"/>

Using soulscript, we can safely reconstruct the prompt for each LLM call with the most up-to-date representation of the agent's personality. We can select just the characteristics we need to build that specific personality filter (i.e. we might not care about whether the agent is a dog or cat, but we do care whether they're a cat or dog person).

## Soulgraph & soulscript

Soulgraph is a platform, with a token on Solana, that enables developers to add persistent, user-bound memory, real-time comms and other "soft-skills" to their agents without having to set up their own infra.

## Contributing

We welcome contributions! Some ways to get involved:

- Craft new souls in the playground and share them with the community
- Submit constructive improvements to the repo or `spec/SPEC.md`
- Join discussions and get involved in [our community Discord](https://discord.gg/TpavQZnT)

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-org/soulscript
cd soulscript

# Try an example agent
cat examples/marcus_aurelius/agent.soul | jq
```

Visit https://soulgra.ph to test an example soul or build your own interactively.
