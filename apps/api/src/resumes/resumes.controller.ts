import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

const UPLOAD_DIR = join(process.cwd(), '..', '..', 'uploads');

@ApiTags('resumes')
@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  create(@Body() dto: CreateResumeDto, @Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.resumesService.create(dto, userId);
  }

  @ApiBearerAuth()
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        isDefault: { type: 'boolean' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        const ok = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ].includes(file.mimetype);
        if (!ok) return cb(new BadRequestException('Only PDF/DOC/DOCX allowed'), false);
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: any, @Body('isDefault') isDefault: any) {
    if (!file) throw new BadRequestException('File is required');
    const userId = req.user.id || req.user.sub;
    const fileUrl = `/uploads/${file.filename}`;

    return this.resumesService.createFromUpload(userId, {
      fileName: file.originalname,
      fileUrl,
      mimeType: file.mimetype,
      size: file.size,
      isDefault: isDefault === 'true' || isDefault === true,
    });
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
