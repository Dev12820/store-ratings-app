import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { SignupUserDto } from './dto/signup-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordDto } from './dto/update-password.dto'; // FIX: Path was incorrect

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signupUserDto: SignupUserDto): Promise<{ message: string }> {
    const existingUser = await this.usersRepository.findOneBy({ email: signupUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email already registered.');
    }
    
    const user = this.usersRepository.create({
        ...signupUserDto,
        password_hash: signupUserDto.password,
        role: UserRole.NORMAL_USER,
    });

    await this.usersRepository.save(user);
    return { message: 'User registered successfully.' };
  }

  async logIn(email: string, pass: string): Promise<{ access_token: string, user: any }> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(pass, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const { password_hash, ...result } = user;
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: result
    };
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(updatePasswordDto.oldPassword, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Old password does not match.');
    }

    user.password_hash = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    await this.usersRepository.save(user);

    return { message: 'Password updated successfully.' };
  }
}