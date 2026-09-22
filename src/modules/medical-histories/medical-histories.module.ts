import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalHistory } from './domain/medical-history.entity';
import { MedicalHistoriesService } from './application/medical-histories.service';
import { MedicalHistoriesController } from './infrastructure/medical-histories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalHistory])],
  controllers: [MedicalHistoriesController],
  providers: [MedicalHistoriesService],
  exports: [MedicalHistoriesService],
})
export class MedicalHistoriesModule {}
