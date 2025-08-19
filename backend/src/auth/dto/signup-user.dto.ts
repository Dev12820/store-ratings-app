import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class SignupUserDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long.'}) // Adjusted for practicality
  @MaxLength(60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one uppercase letter and one special character.',
  })
  password: string;

  @IsString()
  @MaxLength(400)
  @IsOptional()
  address?: string;
}