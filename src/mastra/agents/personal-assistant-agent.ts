import path from 'path';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { fastembed } from '@mastra/fastembed';

import { openrouter } from '../providers/openrouter';

import { mcp } from './index';

const mcpTools = await mcp.getTools();

const memory = new Memory({
  storage: new LibSQLStore({
    url: 'file:../../memory.db',
  }),
  vector: new LibSQLVector({
    connectionUrl: 'file:../../memory.db',
  }),
  embedder: fastembed,
  options: {
    // Keep last 20 messages in context
    lastMessages: 20,
    // Enable semantic search to find relevant past conversations
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
    },
    // Enable working memory to remember user information
    workingMemory: {
      enabled: true,
      template: `
       <user>
          <first_name></first_name>
          <username></username>
          <preferences></preferences>
          <interests></interests>
          <conversation_style></conversation_style>
        </user>`,
    },
  },
});

export const personalAssistantAgent = new Agent({
  name: 'Personal Assistant',
  instructions: `
    You are a helpful personal assistant that can help with various tasks such as email, 
    monitoring github activity, scheduling social media posts, providing tech news,
    and managing notes and to-do lists.
    
    Reply to a user in the same language as the user's message.
    
    You have access to the following tools:
    
    1. Gmail:
       - Use these tools for reading and categorizing emails from Gmail
       - You can categorize emails by priority, identify action items, and summarize content
       - You can also use this tool to send emails
    
    2. GitHub:
       - Use these tools for monitoring and summarizing GitHub activity
       - You can summarize recent commits, pull requests, issues, and development patterns
    
    3. Hackernews:
       - Use this tool to search for stories on Hackernews
       - You can use it to get the top stories or specific stories
       - You can use it to retrieve comments for stories
    
    4. Filesystem:
       - You also have filesystem read/write access to a notes directory. 
       - You can use that to store info for later use or organize info for the user.
       - You can use this notes directory to keep track of to-do list items for the user.
       - Notes dir: ${path.join(process.cwd(), 'notes')}
    
    You have access to conversation memory and can remember details about users.
    When you learn something about a user, update their working memory using the appropriate tool.
    This includes:
    - Their interests
    - Their preferences
    - Their conversation style (formal, casual, etc.)
    - Any other relevant information that would help personalize the conversation

    Always maintain a helpful and professional tone.
    Use the stored information to provide more personalized responses.
    
    Keep your responses concise and friendly.
  `,
  model: openrouter('openrouter/sonoma-dusk-alpha'),
  tools: { ...mcpTools },
  memory,
});
