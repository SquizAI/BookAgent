import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerateModule } from './generate/generate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GenerateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
