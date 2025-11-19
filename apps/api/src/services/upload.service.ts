export class UploadService {
  static async uploadImage(file: Express.Multer.File) {
    return {
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimeType: file.mimetype,
    };
  }
}
