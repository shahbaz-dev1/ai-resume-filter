import { Module } from '@nestjs/common';
import { VectorService } from './vector.service';
import { VectorController } from './vector.controller';
import { EmbeddingService } from './embedding.service';
import { ConfigModule } from '@nestjs/config';

/**
 * Module for vector database operations (semantic search, knowledge storage).
 */
@Module({
  imports: [ConfigModule],
  providers: [VectorService, EmbeddingService],
  controllers: [VectorController],
  exports: [VectorService, EmbeddingService],
})
export class VectorModule {} 