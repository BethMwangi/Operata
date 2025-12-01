import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: '+256700000000', description: 'User phone number' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongpassword', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;
}
