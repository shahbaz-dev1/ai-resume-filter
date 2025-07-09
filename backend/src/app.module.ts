import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VectorModule } from './vector/vector.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get('DATABASE_PATH'),
        autoLoadEntities: true,
        synchronize: true, // Set to false in production!
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    VectorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
