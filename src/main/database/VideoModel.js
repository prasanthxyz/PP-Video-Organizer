import { DataTypes } from 'sequelize'

const VideoModel = {
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  width: {
    type: DataTypes.INTEGER
  },
  height: {
    type: DataTypes.INTEGER
  },
  frameRate: {
    type: DataTypes.FLOAT
  },
  bitRate: {
    type: DataTypes.FLOAT
  },
  duration: {
    type: DataTypes.FLOAT
  },
  quality: {
    type: DataTypes.FLOAT
  }
}

export default VideoModel
