import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {
  @ApiProperty({ example: '+5491112345678', description: 'Número de teléfono en formato internacional' })
  @IsString()
  @Length(8, 20)
  phone: string;
}
