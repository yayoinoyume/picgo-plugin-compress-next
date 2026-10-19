import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import type { IPicGo } from 'picgo';
import { getImageInfo, getUrlInfo } from '../src/utils';
import { Image } from '../src/compress/imagemin/mozjpeg';
import { Buffer2WebPBuffer } from '../src/compress/webp-converter/utils';

// 1x1 png / webp / gif, enough for imageSize to read the dimensions
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8AAAwAB/AF/3gAAAABJRU5ErkJggg==',
  'base64',
);
const WEBP = Buffer.from('UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEAAUAmJaQAA3AA/vuUAAA=', 'base64');

const dir = mkdtempSync(join(tmpdir(), 'compress-next-'));
const pngPath = join(dir, 'image.png');
const webpPath = join(dir, 'image.webp');
writeFileSync(pngPath, PNG);
writeFileSync(webpPath, WEBP);

// Buffer2WebPBuffer writes its temp files next to the module, clean them up
const webpTempDir = join(__dirname, '../src/compress/webp-converter/temp');
afterAll(() => {
  rmSync(webpTempDir, { recursive: true, force: true });
});

const mockCtx = (overrides: Record<string, any> = {}) =>
  ({
    log: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), success: jest.fn() },
    request: jest.fn(),
    ...overrides,
  } as unknown as IPicGo);

describe('getUrlInfo', () => {
  it('ignores the query and hash of a network url', () => {
    expect(getUrlInfo('https://example.com/a/b.png?w=100&t=1#x')).toEqual({
      fileName: 'b.png',
      extname: '.png',
    });
  });

  it('keeps the local file name untouched', () => {
    expect(getUrlInfo('/tmp/a.png')).toEqual({ fileName: 'a.png', extname: '.png' });
  });
});

describe('getImageInfo', () => {
  it('reads the original size of a local file', () => {
    const info = getImageInfo(pngPath, PNG);
    expect(info).toMatchObject({ fileName: 'image.png', extname: '.png', width: 1, height: 1 });
    expect(info.compressionRatio).toBe('100.0%');
  });

  it('does not stat a network url', () => {
    const info = getImageInfo('https://example.com/image.png?w=100', PNG);
    expect(info).toMatchObject({ fileName: 'image.png', extname: '.png' });
    expect(info.compressionRatio).toBe('100.0%');
  });
});

describe('imagemin mozjpeg', () => {
  it('skips the image types it can not handle instead of throwing', async () => {
    const ctx = mockCtx();
    const info = await Image(ctx, { imageUrl: webpPath });
    expect(info).toMatchObject({ extname: '.webp' });
    expect(ctx.log.warn).toHaveBeenCalled();
  });
});

describe('Buffer2WebPBuffer', () => {
  it('works when the input is already a webp', async () => {
    // webp-converter is mocked, the point is the temp file names must not collide
    const toWebP = jest.fn(async (input: string, output: string) => {
      expect(input).not.toBe(output);
      writeFileSync(output, WEBP);
    });
    const result = await Buffer2WebPBuffer(WEBP, '.webp', toWebP as any, '-q 80');
    expect(result.equals(WEBP)).toBe(true);
  });
});
