import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export async function saveOrShareFile(
  fileName: string,
  data: string,
  mimeType: string,
  isBase64 = false
) {
  if (!Capacitor.isNativePlatform()) {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  const result = await Filesystem.writeFile({
    path: fileName,
    data,
    directory: Directory.Cache,
    ...(isBase64 ? {} : { encoding: Encoding.UTF8 }),
  });

  await Share.share({
    title: fileName,
    url: result.uri,
    dialogTitle: 'Exporter',
  });
}
