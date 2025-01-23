import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, TokenPayload } from '../types/custom.type';

@Injectable()
export class JsonwebtokenService extends JwtService {
  async signToken(payload: TokenPayload): Promise<AuthResponse> {
    const accessToken = await this.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
      algorithm: 'HS512',
    });
    const accessTokenExpiresIn = new Date().getTime() + 1000 * 60 * 60 * 24;
    const refreshToken = await this.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
      algorithm: 'HS512',
    });
    const refreshTokenExpiresIn =
      new Date().getTime() + 1000 * 60 * 60 * 24 * 7;

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }
}
