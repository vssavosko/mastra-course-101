import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

import { openrouter } from '../providers/openrouter';

// Create a memory instance with custom conversation history settings
const memory = new Memory({
  storage: new LibSQLStore({
    url: 'file:../../memory.db', // relative path from `.mastra/output` directory
  }),
  options: {
    lastMessages: 20, // Include last 20 messages in context instead of 10 by default
  },
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
