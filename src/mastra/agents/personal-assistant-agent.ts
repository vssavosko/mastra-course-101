import { Agent } from '@mastra/core/agent';

import { openrouter } from '../providers/openrouter';

import { mcp } from './index';

const mcpTools = await mcp.getTools();

export const personalAssistantAgent = new Agent({
  name: 'Personal Assistant',
  instructions: `
    You are a helpful personal assistant that can help with various tasks such as email, 
    monitoring github activity, and scheduling social media posts.

    Reply to a user in the same language as the user's message.
    
    You have access to the following tools:
    
    1. Gmail:
       - Use these tools for reading and categorizing emails from Gmail
       - You can categorize emails by priority, identify action items, and summarize content
       - You can also use this tool to send emails
    
    2. GitHub:
       - Use these tools for monitoring and summarizing GitHub activity
       - You can summarize recent commits, pull requests, issues, and development patterns
    
    Keep your responses concise and friendly.
  `,
  model: openrouter('openrouter/sonoma-dusk-alpha'),
  tools: { ...mcpTools },
});
