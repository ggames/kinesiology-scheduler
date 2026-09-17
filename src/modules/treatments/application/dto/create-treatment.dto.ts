import { IsUUID, IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTreatmentDto {
  @ApiProperty({ format: 'uuid', description: 'Patient UUID' })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ format: 'uuid', description: 'Prescribing professional UUID' })
  @IsUUID()
  @IsNotEmpty()
  professionalId: string;

  @ApiProperty({ example: 'Kinesioterapia lumbar - 10 sesiones', description: 'Treatment description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 10, minimum: 1, description: 'Total number of sessions prescribed' })
  @IsInt()
  @Min(1)
  totalSessions: number;
}
