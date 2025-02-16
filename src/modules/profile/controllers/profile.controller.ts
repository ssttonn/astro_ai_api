import { Body, Controller, Get, Patch, Request } from '@nestjs/common';
import { AuthenticationRequired } from 'src/common/decorators/auth.decorator';
import { TokenPayload } from 'src/common/types/custom.type';
import { NotEmptyPipe } from 'src/shared/pipes/not-empty.pipe';
import { UpdateProfileBodyDto } from '../dtos/update-profile.dto';
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

  @Patch('me')
  @AuthenticationRequired()
  updateProfile(
    @Request() request,
    @Body(NotEmptyPipe) body: UpdateProfileBodyDto,
  ) {
    const { id }: TokenPayload = request.user as TokenPayload;
    return this.profileService.updateProfile(id, body);
  }
}
