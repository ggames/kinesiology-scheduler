import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for account activation: setting password via temporary activation token.
 */
export class ActivateAccountDto {
  @ApiProperty({ description: 'Temporary activation token received by email (valid 24h)' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'NewPassword123!', minLength: 6, description: 'New password set by the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
