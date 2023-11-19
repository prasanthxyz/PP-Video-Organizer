import { DataTypes } from 'sequelize'

const VideoModel = {
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  }
}

export default VideoModel
