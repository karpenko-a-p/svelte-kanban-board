import { json, type RequestHandler } from '@sveltejs/kit';

/**
 * Проверка показателей сервиса
 */
export const GET: RequestHandler = () => {
  const bytesToMb = (bytes: number): string => `${(bytes / 1024 / 1024).toFixed(2)} Mb`;
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return json({
    memoryUsage: {
      rss: bytesToMb(memoryUsage.rss),
      heapTotal: bytesToMb(memoryUsage.heapTotal),
      heapUsed: bytesToMb(memoryUsage.heapUsed),
      external: bytesToMb(memoryUsage.external),
      arrayBuffers: bytesToMb(memoryUsage.arrayBuffers)
    },
    cpuUsage: {
      user: cpuUsage.user,
      system: cpuUsage.system
    }
  });
};
