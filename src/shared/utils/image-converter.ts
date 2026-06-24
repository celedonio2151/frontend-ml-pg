import imageCompression, { type Options } from 'browser-image-compression';

export async function convertToWebP(file: File, customOptions?: Partial<Options>): Promise<File> {
  const options: Options = {
    fileType: 'image/webp',
    //MaxSize y MaxWidth son modificables en la llamada
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    initialQuality: 0.8,
    useWebWorker: true,
    ...customOptions,
  };

  const compressedFile = await imageCompression(file, options);

  return new File([compressedFile], file.name.replace(/\.[^/.]+$/, '.webp'), { type: 'image/webp' });
}
