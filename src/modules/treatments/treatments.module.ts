import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treatment } from './domain/treatment.entity';
import { TreatmentsController } from './infrastructure/treatments.controller';
import { TreatmentsService } from './application/treatments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Treatment])],
  controllers: [TreatmentsController],
  providers: [TreatmentsService],
  exports: [TypeOrmModule, TreatmentsService]
})
export class TreatmentsModule {}
