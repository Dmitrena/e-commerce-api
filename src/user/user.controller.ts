import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CurrentUserId } from './../common/decorators/current-user-id.decorator';
import { AtGuard } from './../common/guards/at.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(AtGuard)
  async getProfile(@CurrentUserId() id: string) {
    return this.userService.findOne(id);
  }
  @Patch('profile')
  @UseGuards(AtGuard)
  async updateProfile(
    @CurrentUserId() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('profile/favorites/:productId')
  @UseGuards(AtGuard)
  async toggleFavorite(
    @Param('productId') productId: number,
    @CurrentUserId() id: string,
  ) {
    return this.userService.toggleFavorite(id, productId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
