import { Controller, Post, Body, UseGuards, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { VectorService } from './vector.service';
import { EmbeddingService } from './embedding.service';
import { JwtAuthGuard } from '../auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

/**
 * Controller for vector database operations (semantic search, knowledge storage).
 */
@UseGuards(JwtAuthGuard)
@Controller('vector')
export class VectorController {
  constructor(
    private readonly vectorService: VectorService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  /**
   * Add a document to the vector DB using text (embedding generated automatically).
   * Expects: { id: string, text: string, metadata: object, provider?: 'openai' | 'gemini' }
   * Requires authentication.
   */
  @Post('add')
  async addDocument(@Body() body: { id: string; text: string; metadata: Record<string, any>; provider?: 'openai' | 'gemini' }) {
    const vector = await this.embeddingService.generateEmbedding(body.text, body.provider);
    await this.vectorService.addDocument(body.id, vector, { ...body.metadata, text: body.text });
    return { message: 'Document added' };
  }

  /**
   * Search for similar documents by text (embedding generated automatically).
   * Expects: { text: string, topK?: number, provider?: 'openai' | 'gemini' }
   * Requires authentication.
   */
  @Post('search')
  async search(@Body() body: { text: string; topK?: number; provider?: 'openai' | 'gemini' }) {
    const vector = await this.embeddingService.generateEmbedding(body.text, body.provider);
    const results = await this.vectorService.search(vector, body.topK);
    return { results };
  }

  /**
   * Analyze CV: Accepts file upload (PDF, DOCX), job description, and model.
   * Parses file, sends both to AI for analysis, stores all details, returns analysis.
   */
  @Post('analyze')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/msword') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF and DOCX files are allowed!'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  async analyzeCV(
    @UploadedFile() file: Express.Multer.File,
    @Body('jobDescription') jobDescription: string,
    @Body('model') model: 'openai' | 'gemini',
    @Req() req: any
  ) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    // Parse file content
    let fileContent = '';
    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(fs.readFileSync(file.path));
      fileContent = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/msword') {
      const data = await mammoth.extractRawText({ path: file.path });
      fileContent = data.value;
    } else {
      return { error: 'Unsupported file type' };
    }
    // Call AI for analysis (example: concatenate and embed, or call LLM)
    // Here, just concatenate for demo; replace with your AI logic
    const analysis = await this.embeddingService.analyzeCVWithJob(fileContent, jobDescription, model);
    // Generate embedding for the CV content using the selected model
    let vector = await this.embeddingService.generateEmbedding(fileContent, model);
    // Ensure vector is exactly 1536 elements (pad or truncate as needed)
    if (vector.length < 1536) {
      vector = [...vector, ...Array(1536 - vector.length).fill(0)];
    } else if (vector.length > 1536) {
      vector = vector.slice(0, 1536);
    }
    // Store in vector DB (or relational DB as needed)
    // await this.vectorService.addDocument(
    //   `${Date.now()}-${file.originalname}`,
    //   vector, // Use fixed-length embedding vector
    //   {
    //     // Only include 'text' field in metadata for schema consistency
    //     text: JSON.stringify({
    //       userId: req.user?.userId,
    //       fileName: file.originalname,
    //       fileContent,
    //       jobDescription,
    //       analysis,
    //       uploadedAt: new Date().toISOString(),
    //     }),
    //   }
    // );
    // Optionally, delete file after processing
    fs.unlinkSync(file.path);
    return { analysis };
  }
} 