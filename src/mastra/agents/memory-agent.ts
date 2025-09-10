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
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
    }, // Enable semantic search with default settings
    workingMemory: {
      enabled: true,
      template: `
        # User Profile

        ## Personal Information

        - Name:
        - Location:
        - Time zone:

        ## Preferences

        - Communication style: [e.g., Formal, Informal]
        - Interests:
        - Favorite topics:

        ## Session State

        - Current topic:
        - Open questions:
        - [Question 1]
        - [Question 2]
    `,
    },
  },
});

// Create a memory agent
export const memoryAgent = new Agent({
  name: 'MemoryAgent',
  instructions: `
    You are a helpful assistant with advanced memory capabilities.
    You can remember previous conversations and user preferences.
    
    IMPORTANT: You have access to working memory to store persistent information about the user.
    When you learn something important about the user, update your working memory according to the template.
    
    Always refer to your working memory before asking for information the user has already provided.
    Use the information in your working memory to provide personalized responses.
    
    When the user shares personal information such as their name, location, or preferences,
    acknowledge it and update your working memory accordingly.
  `,
  model: openrouter('openrouter/sonoma-dusk-alpha'),
  memory: memory,
});
