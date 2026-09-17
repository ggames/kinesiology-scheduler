import { IsEmail, IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for Admin registration of Professional profile and Auth User account.
 */
export class RegisterProfessionalDto {
  @ApiProperty({ example: 'dr.perez@example.com', description: 'Professional email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Carlos', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '28765432', description: 'Document ID / DNI' })
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @ApiProperty({ example: 'MP-12345', description: 'Professional license number (Matrícula)' })
  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty({ example: 'Traumatología y Fisioterapia', description: 'Specialty' })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiPropertyOptional({ example: ['PROFESSIONAL', 'ADMIN'], description: 'Assigned roles (can have multiple roles)' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: string[] = ['PROFESSIONAL'];

  @ApiPropertyOptional({ example: '+5491112345678', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phone?: string;
}
