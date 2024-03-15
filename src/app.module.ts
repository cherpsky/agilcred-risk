import { Module } from '@nestjs/common';
import { RiskEvaluationController } from './risk-evaluation/risk-evaluation.controller';
import { RiskEvaluationService } from './risk-evaluation/risk-evaluation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogServiceEntity } from 'data/entities/remote/log-service.entity';
import { LogService } from 'services/log.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Solicitud } from 'data/entities/remote/solicitud.entity';
import { SolicitudService } from 'services/solicitud.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get('DATABASE_HOST'),
          port: config.get('DATABASE_PORT'),
          username: config.get('DATABASE_USER'),
          password: config.get('DATABASE_PASSWORD'),
          database: config.get('DATABASE_NAME'),
          entities: [LogServiceEntity, Solicitud],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([LogServiceEntity, Solicitud]),
  ],
  controllers: [RiskEvaluationController],
  providers: [RiskEvaluationService, LogService, SolicitudService],
})
export class AppModule {}
