import * as path from 'path';
import { ModelStatic, Sequelize } from 'sequelize';
import GalleryModel, { IGalleryModel } from './GalleryModel';
import TagModel, { ITagModel } from './TagModel';
import VideoModel, { IVideoModel } from './VideoModel';

let sequelize: Sequelize | null = null;
export let Tag: ModelStatic<ITagModel> | null = null;
export let Gallery: ModelStatic<IGalleryModel> | null = null;
export let Video: ModelStatic<IVideoModel> | null = null;

function createTables(): void {
  if (!sequelize) return;
  Tag = sequelize.define<ITagModel>('Tag', TagModel);
  Gallery = sequelize.define<IGalleryModel>('Gallery', GalleryModel);
  Video = sequelize.define<IVideoModel>('Video', VideoModel);
  Video.belongsToMany(Gallery, { through: 'VideoGallery' });
  Gallery.belongsToMany(Video, { through: 'VideoGallery' });
  Video.belongsToMany(Tag, { through: 'VideoTag' });
  Tag.belongsToMany(Video, { through: 'VideoTag' });
}

export async function setupDB(app: Electron.App): Promise<void> {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(app.getPath('home'), 'pvorg.db'),
    logging: false,
  });

  createTables();

  console.log('Syncing DB...');
  await sequelize.sync();
}
