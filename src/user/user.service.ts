import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from './../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { returnUserObject } from './return-user.object';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        hash: hash,
        name: createUserDto.name,
        avatarPath: createUserDto.avatarPath,
        phone: createUserDto.phone,
      },
    });
    return newUser;
  }

  async findOne(id: string, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      // include: { favorites: true },
      select: {
        ...returnUserObject,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
          },
        },
        ...selectObject,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  findByName(name: string) {
    return this.prisma.user.findUnique({ where: { name: name } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...userData } = updateUserDto;
    // const hash = await this.hashData(password);
    const hash = password && (await this.hashData(password));
    const user = await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        hash: updateUserDto.password ? hash : user.hash,
      },
    });
  }

  async updateRt(id: string) {
    return this.prisma.user.updateMany({
      where: {
        id: id,
        hashedRt: { not: null },
      },
      data: { hashedRt: null },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async toggleFavorite(id: string, productId: number) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('User not found!');

    const isExists = user.favorites.some((product) => product.id == productId);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        favorites: {
          [isExists ? 'disconnect' : 'connect']: {
            id: +productId,
          },
        },
      },
    });
    return { message: 'Success' };
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
}
