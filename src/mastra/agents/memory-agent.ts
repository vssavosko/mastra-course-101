import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

import { openrouter } from '../providers/openrouter';

// Create a basic memory instance
const memory = new Memory({
  storage: new LibSQLStore({
    url: 'file:../../memory.db', // relative path from `.mastra/output` directory
  }),
});

// Create a memory agent
export const memoryAgent = new Agent({
  name: 'MemoryAgent',
  instructions: `
    You are a helpful assistant with memory capabilities.
    You can remember previous conversations and user preferences.
    When a user shares information about themselves, acknowledge it and remember it for future reference.
    If asked about something mentioned earlier in the conversation, recall it accurately.
  `,
  model: openrouter('openrouter/sonoma-dusk-alpha'),
  memory: memory,
});
