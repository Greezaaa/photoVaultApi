import { BlobStorageService } from '@config/services/BlobStorageService';
import { UseRoles, UseStatus } from '@decorators';
import { JwtAuthGuard, RolesGuard, StatusGuard } from '@guards';
import { AuthRequest, UserRoles, UserStatus } from '@interfaces';
import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly blobStorageService: BlobStorageService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @UseRoles(UserRoles.USER)
  @UseStatus(UserStatus.ACTIVE)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Req() req: AuthRequest, @UploadedFile() file: Express.Multer.File) {
    const id = req.user.id;
    const imageUrl = await this.blobStorageService.uploadImage(file, id);
    return { imageUrl };
  }

  @Get(':imageName')
  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @UseRoles(UserRoles.USER)
  @UseStatus(UserStatus.ACTIVE)
  async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imageStream = await this.blobStorageService.getImage(imageName);
    res.setHeader('Content-Type', 'image/jpeg');
    imageStream.pipe(res);
  }
}
