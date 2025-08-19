import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { UpdatePasswordDto } from './dto/update-password.dto'; // FIX: Path was incorrect

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signUp(signupUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  logIn(@Body() loginDto: LoginDto) {
    return this.authService.logIn(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(req.user.userId, updatePasswordDto);
  }
}