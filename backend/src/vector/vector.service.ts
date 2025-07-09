import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Table, Connection } from 'vectordb';
import * as path from 'path';

/**
 * Service for vector database operations (semantic search, knowledge storage).
 */
@Injectable()
export class VectorService implements OnModuleInit {
  private db: Connection;
  private table: Table;

  async onModuleInit() {
    // Initialize the vector DB with SQLite backend
    this.db = await connect({ uri: path.resolve(__dirname, '../../data/vector.sqlite') });
    // Try to open the table, or create if it doesn't exist
    try {
      this.table = await this.db.openTable('knowledge');
    } catch (e) {
      this.table = await this.db.createTable('knowledge', [
        { id: 'example', vector: Array(1536).fill(0), metadata: { text: 'example' } },
      ]);
    }
  }

  /**
   * Add a document with embedding to the vector DB.
   * @param id Unique document ID
   * @param vector Embedding vector
   * @param metadata Any metadata (e.g., text, tags)
   */
  async addDocument(id: string, vector: number[], metadata: Record<string, any>) {
    await this.table.add([{ id, vector, metadata }]);
  }

  /**
   * Search for similar documents by embedding.
   * @param vector Embedding vector
   * @param topK Number of results to return
   */
  async search(vector: number[], topK = 5) {
    return this.table.search(vector).limit(topK).execute();
  }
} 