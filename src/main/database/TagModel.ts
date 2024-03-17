import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { IVideoModel } from './VideoModel';

export interface ITagModel
  extends Model<
    InferAttributes<ITagModel>,
    InferCreationAttributes<ITagModel>
  > {
  getVideos(arg0: { raw: boolean }): IVideoModel[];
  removeVideos(remove: string[]): void;
  addVideos(add: string[]): void;
  title: string;
}

const TagModel = {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
};

export default TagModel;
