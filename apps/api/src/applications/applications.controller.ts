import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // CANDIDATE: Apply
  @Roles('CANDIDATE')
  @UseGuards(RolesGuard)
  @Post()
  apply(@Body() dto: ApplyJobDto, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.applicationsService.apply(dto, userId);
  }

  // CANDIDATE: My Status
  @Roles('CANDIDATE')
  @UseGuards(RolesGuard)
  @Get('me')
  findMy(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.applicationsService.findMyApplications(userId);
  }

  // RECRUITER/ADMIN: View applicants by Job
  @Roles('RECRUITER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Get('job/:jobId')
  findByJob(@Param('jobId') jobId: string, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.applicationsService.findByJob(jobId, userId);
  }

  // RECRUITER/ADMIN: Update Status
  @Roles('RECRUITER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @Req() req: any,
  ) {
    const userId = req.user.id || req.user.sub;
    return this.applicationsService.updateStatus(id, dto.status, userId);
  }
}
