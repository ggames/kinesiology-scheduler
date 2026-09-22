import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: '+5491112345678' })
  @IsString()
  @Length(8, 20)
  phone: string;

  @ApiProperty({ example: '482915', description: 'Código OTP de 6 dígitos' })
  @IsString()
  @Length(6, 6)
  code: string;
}
