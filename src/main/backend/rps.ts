import * as db from './db';

export async function getCombinationsData(
  videoPaths: Set<string>,
  tagsSet: Set<string>,
  galleriesSet: Set<string>,
): Promise<[string, string][]> {
  const videos = await db.getSelectedVideos([...videoPaths]);
  const combinationsData: [string, string][] = [];
  videos.forEach(({ videoPath, videoTags, videoGalleries }) => {
    const commonGalleries = videoGalleries.filter((gallery: string) =>
      galleriesSet.has(gallery),
    );
    if (commonGalleries.length === 0) return;

    const commonTags = videoTags.filter((tag: string) => tagsSet.has(tag));
    if (commonTags.length !== tagsSet.size) return;

    commonGalleries.forEach((gallery: string) => {
      combinationsData.push([videoPath, gallery]);
    });
  });
  return combinationsData;
}
