import fs from 'fs/promises';
import path from 'path';

export class StorageMonitorService {
  static async getStorageInfo() {
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    const stats = await this.getDirSize(uploadDir);
    
    return {
      totalSize: stats.size,
      totalFiles: stats.files,
      sizeInMB: (stats.size / 1024 / 1024).toFixed(2),
      sizeInGB: (stats.size / 1024 / 1024 / 1024).toFixed(2),
      categories: await this.getCategoryStats(uploadDir)
    };
  }

  private static async getDirSize(dirPath: string): Promise<{ size: number; files: number }> {
    let totalSize = 0;
    let totalFiles = 0;

    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          const subStats = await this.getDirSize(fullPath);
          totalSize += subStats.size;
          totalFiles += subStats.files;
        } else {
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;
          totalFiles++;
        }
      }
    } catch (error) {
      console.error('Erro ao calcular tamanho do diretório:', error);
    }

    return { size: totalSize, files: totalFiles };
  }

  private static async getCategoryStats(uploadDir: string) {
    try {
      const categories = await fs.readdir(uploadDir, { withFileTypes: true });
      
      const stats = await Promise.all(
        categories
          .filter(cat => cat.isDirectory())
          .map(async (cat) => {
            const stats = await this.getDirSize(path.join(uploadDir, cat.name));
            return {
              category: cat.name,
              size: stats.size,
              files: stats.files,
              sizeInMB: (stats.size / 1024 / 1024).toFixed(2)
            };
          })
      );

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas de categorias:', error);
      return [];
    }
  }
}
