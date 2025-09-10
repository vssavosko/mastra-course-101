import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { fastembed } from '@mastra/fastembed';

import { openrouter } from '../providers/openrouter';

// Create a memory instance with custom conversation history settings
const memory = new Memory({
  storage: new LibSQLStore({
    url: 'file:../../memory.db', // relative path from `.mastra/output` directory
  }),
  vector: new LibSQLVector({
    connectionUrl: 'file:../../vector.db', // relative path from `.mastra/output` directory
  }), // Vector database for semantic search
  embedder: fastembed, // Embedder for message embeddings
  options: {
    lastMessages: 20, // Include last 20 messages in context
    semanticRecall: true, // Enable semantic search with default settings
  },
});

// Create a memory agent
export const memoryAgent = new Agent({
  name: 'MemoryAgent',
  instructions: `
    You are a helpful assistant with advanced memory capabilities.
    You can remember previous conversations and user preferences.
    When a user shares information about themselves, acknowledge it and remember it for future reference.
    If asked about something mentioned earlier in the conversation, recall it accurately.
    You can also recall relevant information from older conversations when appropriate.
  `,
  model: openrouter('openrouter/sonoma-dusk-alpha'),
  memory: memory,
});
