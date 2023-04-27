import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from './../prisma/prisma.service';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { UserService } from './../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: CreateUserDto): Promise<Tokens> {
    const existUserByEmail = await this.userService.findByEmail(dto.email);
    if (existUserByEmail)
      throw new BadRequestException('User with this email is already exist!');

    const existUserByName = await this.userService.findByName(dto.name);
    if (existUserByName)
      throw new BadRequestException('User with this name is already exist!');

    const newUser = await this.userService.create(dto);

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refreshToken);
    // return tokens;
    return {
      user: this.returnUserFields(newUser),
      ...tokens,
    };
  }

  async signin(dto: AuthDto): Promise<Tokens> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatched = await argon2.verify(user.hash, dto.password);
    if (!passwordMatched) throw new BadRequestException('Password is invalid');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async logout(userId: string) {
    const logoutUser = await this.userService.updateRt(userId);
    if (logoutUser) return 'Success';
  }

  async refreshToken(userId: string, rt: string) {
    const selectObject: Prisma.UserSelect = {
      hashedRt: true,
    };
    const user = await this.userService.findOne(userId, selectObject);
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon2.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  // Support functions

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('RT_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }
}
