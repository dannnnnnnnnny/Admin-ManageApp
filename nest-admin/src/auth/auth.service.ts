import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async userId(request: Request): Promise<number> {
    const jwt = request.cookies.jwt;

    const data = await this.jwtService.verifyAsync(jwt); // { id, iat, exp } 형태의 값이 리턴

    return data.id;
  }
}
