import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { IVideoModel } from './VideoModel';

export interface IGalleryModel
  extends Model<
    InferAttributes<IGalleryModel>,
    InferCreationAttributes<IGalleryModel>
  > {
  getVideos(arg0: { raw: boolean }): IVideoModel[];
  removeVideos(remove: string[]): void;
  addVideos(add: string[]): void;
  galleryPath: string;
}

const GalleryModel = {
  galleryPath: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
};

export default GalleryModel;
