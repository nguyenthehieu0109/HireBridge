import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  create(@Body() dto: CreateResumeDto, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.resumesService.create(dto, userId);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.resumesService.findAll(userId);
  }

  @Patch(':id/default')
  setDefault(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.resumesService.setDefault(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.resumesService.remove(id, userId);
  }
}
