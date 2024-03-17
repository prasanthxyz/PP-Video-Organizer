import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { ITagModel } from './TagModel';
import { IGalleryModel } from './GalleryModel';

export interface IVideoModel
  extends Model<
    InferAttributes<IVideoModel>,
    InferCreationAttributes<IVideoModel>
  > {
  removeGalleries(remove: string[]): void;
  addGalleries(add: string[]): void;
  removeTags(remove: string[]): void;
  addTags(add: string[]): void;
  getTags(arg0?: { raw: boolean }): ITagModel[];
  getGalleries(arg0?: { raw: boolean }): IGalleryModel[];
  filePath: string;
  width: number;
  height: number;
  frameRate: number;
  bitRate: number;
  duration: number;
  quality: number;
}

const VideoModel = {
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  width: {
    type: DataTypes.INTEGER,
  },
  height: {
    type: DataTypes.INTEGER,
  },
  frameRate: {
    type: DataTypes.FLOAT,
  },
  bitRate: {
    type: DataTypes.FLOAT,
  },
  duration: {
    type: DataTypes.FLOAT,
  },
  quality: {
    type: DataTypes.FLOAT,
  },
};

export default VideoModel;
