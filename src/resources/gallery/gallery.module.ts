import { BlobStorageService } from '@config/services/BlobStorageService';
import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
  imports: [],
  controllers: [GalleryController],
  providers: [GalleryService, BlobStorageService],
})
export class GalleryModule {}
