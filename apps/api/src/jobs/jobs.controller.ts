import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/jwt.guard'; // đúng tên file guard của bạn
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // PUBLIC: GET /jobs?q=&location=&level=
  @Get()
  findAll(@Query() query: any) {
    return this.jobsService.findAll(query);
  }

  // PUBLIC: GET /jobs/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  // PROTECTED: POST /jobs (RECRUITER, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RECRUITER', 'ADMIN')
  @Post()
  create(@Body() dto: CreateJobDto, @Req() req: any) {
    const userId = req.user?.sub ?? req.user?.id; // tuỳ bạn set payload
    return this.jobsService.create(dto, userId);
  }

  // PROTECTED: PATCH /jobs/:id (RECRUITER, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RECRUITER', 'ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  // PROTECTED: DELETE /jobs/:id (ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
