import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// This guard protects routes by requiring a valid JWT
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}