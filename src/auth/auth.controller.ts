import { CurrentUser } from './../common/decorators/current-user.decorator';
import { RtGuard } from './../common/guards/rt.guard';
import { CurrentUserId } from './../common/decorators/current-user-id.decorator';
import { AtGuard } from './../common/guards/at.guard';
import { Tokens } from './types/tokens.type';
import { CreateUserDto } from './../user/dto/create-user.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @CurrentUserId() userId: string,
    @CurrentUser('refreshToken') rt: string,
  ) {
    return this.authService.refreshToken(userId, rt);
  }
}
