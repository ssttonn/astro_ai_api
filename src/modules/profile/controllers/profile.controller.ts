import { Controller, Get, Request } from '@nestjs/common';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import { TokenPayload } from 'src/common/types/custom.type';
import { ProfileService } from '../services/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @AuthenticationRequired()
  getProfile(@Request() request) {
    const { id }: TokenPayload = request.user as TokenPayload;
    return this.profileService.getProfile(id);
  }
}
