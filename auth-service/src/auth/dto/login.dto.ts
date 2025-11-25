import { IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '+254700000000', description: 'User phone number' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'strongpassword', description: 'User password' })
  @IsString()
  password: string;
}
