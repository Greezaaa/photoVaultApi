import { BlobClient, BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { NoConnectionOptionError } from 'typeorm';

@Injectable()
export class BlobStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor() {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_CONTAINER_NAME;

    if (!AZURE_STORAGE_CONNECTION_STRING || !containerName) {
      throw new NoConnectionOptionError('Azure Storage Connection String or Container Name is missing.');
    }

    this.blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    this.containerClient = this.blobServiceClient.getContainerClient(containerName);
  }

  async uploadImage(file: Express.Multer.File, userId: string): Promise<string> {
    const blobName = `${userId}/${file.originalname}`;
    const blobClient: BlobClient = this.containerClient.getBlockBlobClient(blobName);
    const blockBlobClient = blobClient.getBlockBlobClient();

    const uploadStream = file.buffer;

    await blockBlobClient.uploadData(uploadStream, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    return `https://${this.blobServiceClient.accountName}.blob.core.windows.net/${this.containerClient.containerName}/${blobName}`;
    // return `https://photoapiv1.blob.core.windows.net/gallery-dev-v1/${blobName}`;
  }

  async getImage(blobName: string): Promise<Readable> {
    const blobClient: BlobClient = this.containerClient.getBlobClient(blobName);
    const downloadBlockBlobResponse = await blobClient.download();

    // Convert Azure's ReadableStream into a Node.js Readable stream
    const readableStream = downloadBlockBlobResponse.readableStreamBody;

    // Ensure it's a proper Node.js Readable stream
    return Readable.from(readableStream ?? '');
  }
}
