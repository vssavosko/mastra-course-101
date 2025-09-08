import path from 'path';

import { MCPClient } from '@mastra/mcp';

export const mcp = new MCPClient({
  servers: {
    zapier: {
      url: new URL(process.env.ZAPIER_MCP_URL ?? ''),
    },
    github: {
      url: new URL('https://api.githubcopilot.com/mcp/'),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        },
      },
    },
    hackernews: {
      command: 'npx',
      args: ['-y', '@devabdultech/hn-mcp-server'],
    },
    textEditor: {
      command: 'pnpx',
      args: [
        `@modelcontextprotocol/server-filesystem`,
        path.join(process.cwd(), '..', '..', 'notes'), // relative to output directory
      ],
    },
  },
});
