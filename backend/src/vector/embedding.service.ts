import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

/**
 * Service to generate embeddings from text using OpenAI or Gemini.
 */
@Injectable()
export class EmbeddingService {
  private openai: OpenAI | undefined;
  private gemini: GoogleGenAI;
  private defaultProvider: 'openai' | 'gemini';

  constructor(private configService: ConfigService) {
    // Initialize OpenAI only if API key is present
    const openaiKey = configService.get('OPENAI_API_KEY');
    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    } else {
      this.openai = undefined;
    }
    // Initialize Gemini
    this.gemini = new GoogleGenAI({ apiKey: configService.get('GEMINI_API_KEY') });
    // Set default provider
    this.defaultProvider = (configService.get('EMBEDDING_PROVIDER') as 'openai' | 'gemini') || 'gemini';
  }

  /**
   * Generate embedding for text using the selected provider.
   * @param text The input text
   * @param provider 'openai' | 'gemini' (default: this.defaultProvider)
   * @returns Embedding vector as number[]
   */
  async generateEmbedding(text: string, provider?: 'openai' | 'gemini'): Promise<number[]> {
    const useProvider = provider || this.defaultProvider;
    if (useProvider === 'openai') {
      if (!this.openai) {
        throw new Error('OpenAI API key is missing. Set OPENAI_API_KEY in your environment.');
      }
      // OpenAI: text-embedding-3-small (or text-embedding-ada-002)
      const resp = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return resp.data[0].embedding;
    } else {
      // Gemini: embedding-001 (768 dimensions)
      // Use the Gemini embedding method from @google/genai
      // The correct method is: this.gemini.models.embedContent({ model: 'models/embedding-001', contents: text })
      try {
        const result = await this.gemini.models.embedContent({
          model: 'models/embedding-001',
          contents: text,
        });
        // Defensive: check for result.embeddings[0].values
        if (!result || !result.embeddings || !Array.isArray(result.embeddings) || !result.embeddings[0]?.values) {
          throw new Error('Invalid Gemini embedding response');
        }
        return result.embeddings[0].values;
      } catch (err) {
        // Log error for maintainability
        console.error('[Gemini] Embedding error:', err);
        throw new Error('Failed to generate embedding with Gemini: ' + (err?.message || err));
      }
    }
  }

  /**
   * Analyze CV and job description using the selected AI model.
   * Generates embeddings for both, computes cosine similarity, and returns analysis.
   */
  async analyzeCVWithJob(fileContent: string, jobDescription: string, model: 'openai' | 'gemini'): Promise<any> {
    // Generate embeddings for both CV and job description
    const cvEmbedding = await this.generateEmbedding(fileContent, model);
    const jobEmbedding = await this.generateEmbedding(jobDescription, model);
    // Compute cosine similarity
    function cosineSimilarity(a: number[], b: number[]): number {
      const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
      const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
      return normA && normB ? dot / (normA * normB) : 0;
    }
    const score = cosineSimilarity(cvEmbedding, jobEmbedding);
    // Generate a human-readable summary based on the similarity score
    let summary: string;
    if (score > 0.8) {
      summary = `Strong match: The CV and job description are highly aligned. (Similarity: ${(score * 100).toFixed(1)}%)`;
    } else if (score > 0.5) {
      summary = `Moderate match: The CV and job description have some overlap. (Similarity: ${(score * 100).toFixed(1)}%)`;
    } else {
      summary = `Low match: The CV and job description have limited alignment. (Similarity: ${(score * 100).toFixed(1)}%)`;
    }
    return {
      summary,
      fileExcerpt: fileContent.slice(0, 300),
      jobExcerpt: jobDescription.slice(0, 300),
      modelUsed: model,
      matchScore: score,
    };
  }
} 