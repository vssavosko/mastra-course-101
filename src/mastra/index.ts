import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import {
  contentWorkflow,
  aiContentWorkflow,
  parallelAnalysisWorkflow,
} from './workflows/content-workflow';
import { weatherAgent } from './agents/weather-agent';
import { financialAgent } from './agents/financial-agent';
import { personalAssistantAgent } from './agents/personal-assistant-agent';
import { memoryAgent } from './agents/memory-agent';
import { learningAssistantAgent } from './agents/learning-assistant-agent';
import { contentAgent } from './agents/content-agent';

export const mastra = new Mastra({
  workflows: { weatherWorkflow, contentWorkflow, aiContentWorkflow, parallelAnalysisWorkflow },
  agents: {
    weatherAgent,
    financialAgent,
    personalAssistantAgent,
    memoryAgent,
    learningAssistantAgent,
    contentAgent,
  },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ':memory:',
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
