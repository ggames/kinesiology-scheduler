import { IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordPhoneDto {
  @ApiProperty({ example: '+5491112345678' })
  @IsString()
  @Length(8, 20)
  phone: string;

  @ApiProperty({ example: '482915', description: 'Código OTP de 6 dígitos (válido por 10 min)' })
  @IsString()
  @Length(6, 6)
  code: string;

  @ApiProperty({ example: 'NuevaClaveSegura123', description: 'Nueva contraseña (mín. 6 caracteres)' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
