import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RiskEvaluationController } from './risk-evaluation/risk-evaluation.controller';
import { RiskEvaluationService } from './risk-evaluation/risk-evaluation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogServiceEntity } from 'data/entities/remote/log-service.entity';
import { LogService } from 'services/log.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('CONFIG', config.get('DATABASE_HOST'));
        console.log('CONFIG', config.get('DATABASE_PORT'));
        console.log('CONFIG', config.get('DATABASE_USER'));
        console.log('CONFIG', config.get('DATABASE_PASSWORD'));
        console.log('CONFIG', config.get('DATABASE_NAME'));
        return {
          type: 'mysql',
          host: config.get('DATABASE_HOST'),
          port: config.get('DATABASE_PORT'),
          username: config.get('DATABASE_USER'),
          password: config.get('DATABASE_PASSWORD'),
          database: config.get('DATABASE_NAME'),
          entities: [LogServiceEntity],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([LogServiceEntity]),
  ],
  controllers: [AppController, RiskEvaluationController],
  providers: [AppService, RiskEvaluationService, LogService],
})
export class AppModule {}
