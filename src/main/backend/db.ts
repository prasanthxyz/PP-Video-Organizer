import { Op } from 'sequelize';
import { Gallery, Tag, Video } from '../database/database';
import { IVideoModel } from '../database/VideoModel';
import { IGalleryModel } from '../database/GalleryModel';
import { ITagModel } from '../database/TagModel';
import { IDiffObj } from '../../renderer/types';

export async function deleteVideo(videoPath: string): Promise<void> {
  if (Video) await Video.destroy({ where: { filePath: videoPath } });
}

export async function deleteVideos(videoPaths: string[]): Promise<void> {
  if (Video)
    await Video.destroy({ where: { filePath: { [Op.in]: videoPaths } } });
}

export async function deleteTag(tagTitle: string): Promise<void> {
  if (Tag) await Tag.destroy({ where: { title: tagTitle } });
}

export async function deleteGallery(galleryPath: string): Promise<void> {
  if (Gallery) await Gallery.destroy({ where: { galleryPath } });
}

export async function deleteGalleries(galleryPaths: string[]): Promise<void> {
  if (Gallery)
    await Gallery.destroy({
      where: { galleryPath: { [Op.in]: galleryPaths } },
    });
}

export async function getVideos(): Promise<IVideoModel[]> {
  if (Video) return Video.findAll({ raw: true });
  return [];
}

export async function getTags(): Promise<ITagModel[]> {
  if (Tag) return Tag.findAll({ raw: true });
  return [];
}

export async function getGalleries(): Promise<IGalleryModel[]> {
  if (Gallery) return Gallery.findAll({ raw: true });
  return [];
}

export async function createVideos(
  videos: Partial<IVideoModel>[],
): Promise<void> {
  if (Video) await Video.bulkCreate(videos as IVideoModel[]);
}

export async function createTags(tagTitles: string): Promise<void> {
  const existingTags = new Set(
    (await getTags()).map((t: ITagModel) => t.title),
  );
  const validTags = tagTitles
    .toLowerCase()
    .split(' ')
    .map((tagTitle) => tagTitle.trim())
    .filter((tagTitle) => tagTitle !== '' && !existingTags.has(tagTitle))
    .map((tagTitle) => ({ title: tagTitle }));
  if (Tag) Tag.bulkCreate(validTags);
}

export async function createGallery(galleryPath: string): Promise<void> {
  const existingGalleries = new Set(
    (await getGalleries()).map((g: IGalleryModel) => g.galleryPath),
  );
  if (existingGalleries.has(galleryPath)) return;
  if (Gallery) await Gallery.create({ galleryPath });
}

export async function getVideoData(videoPath: string): Promise<{
  tags: ITagModel[];
  galleries: IGalleryModel[];
}> {
  if (!Video || !Tag || !Gallery)
    return Promise.resolve({ tags: [], galleries: [] });
  const videoObj = await Video.findOne({
    where: { filePath: videoPath },
    include: [Tag, Gallery],
  });
  if (!videoObj) return { tags: [], galleries: [] };
  return {
    tags: await videoObj.getTags({ raw: true }),
    galleries: await videoObj.getGalleries({ raw: true }),
  };
}

export async function getGalleryData(
  galleryPath: string,
): Promise<{ videos: IVideoModel[] }> {
  if (!Gallery || !Video) return Promise.resolve({ videos: [] });
  const galleryObj = await Gallery.findOne({
    where: { galleryPath },
    include: [Video],
  });
  return {
    videos: galleryObj ? await galleryObj.getVideos({ raw: true }) : [],
  };
}

export async function getTagData(
  tagTitle: string,
): Promise<{ videos: IVideoModel[] }> {
  if (!Tag || !Video) return Promise.resolve({ videos: [] });
  const tagObj = await Tag.findOne({
    where: { title: tagTitle },
    include: [Video],
  });
  return {
    videos: tagObj ? await tagObj.getVideos({ raw: true }) : [],
  };
}

export async function updateVideoTags(
  videoPath: string,
  diffObj: IDiffObj,
): Promise<void> {
  if (!Video) return;
  const videoObj = await Video.findOne({ where: { filePath: videoPath } });
  if (!videoObj) return;
  await videoObj.addTags(diffObj.add);
  await videoObj.removeTags(diffObj.remove);
}

export async function updateVideoGalleries(
  videoPath: string,
  diffObj: IDiffObj,
): Promise<void> {
  if (!Video) return;
  const videoObj = await Video.findOne({ where: { filePath: videoPath } });
  if (!videoObj) return;
  await videoObj.addGalleries(diffObj.add);
  await videoObj.removeGalleries(diffObj.remove);
}

export async function updateGalleryVideos(
  galleryPath: string,
  diffObj: IDiffObj,
): Promise<void> {
  if (!Gallery) return;
  const galleryObj = await Gallery.findOne({ where: { galleryPath } });
  if (!galleryObj) return;
  await galleryObj.addVideos(diffObj.add);
  await galleryObj.removeVideos(diffObj.remove);
}

export async function updateTagVideos(
  tagTitle: string,
  diffObj: IDiffObj,
): Promise<void> {
  if (!Tag) return;
  const tagObj = await Tag.findOne({ where: { title: tagTitle } });
  if (!tagObj) return;
  await tagObj.addVideos(diffObj.add);
  await tagObj.removeVideos(diffObj.remove);
}

export async function getSelectedVideos(videoPaths: string[]): Promise<
  {
    videoPath: string;
    videoTags: string[];
    videoGalleries: string[];
  }[]
> {
  if (!Video || !Tag || !Gallery) return Promise.resolve([]);
  const videoObjs: IVideoModel[] = await Video.findAll({
    where: { filePath: { [Op.in]: videoPaths } },
    include: [Tag, Gallery],
  });
  return Promise.all(
    videoObjs.map(async (v: IVideoModel) => ({
      videoPath: v.filePath,
      videoTags: (await v.getTags()).map((t: ITagModel) => t.title),
      videoGalleries: (await v.getGalleries()).map(
        (g: IGalleryModel) => g.galleryPath,
      ),
    })),
  );
}
