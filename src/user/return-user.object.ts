import { Prisma } from '@prisma/client';
export const returnUserObject: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  avatarPath: true,
  hash: false,
  phone: true,
};
