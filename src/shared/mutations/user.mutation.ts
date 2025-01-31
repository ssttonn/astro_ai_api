import { PrismaService } from 'src/common/prisma/prisma.service';

class UserMutation {
  constructor(private readonly prismaService: PrismaService) {}
}
