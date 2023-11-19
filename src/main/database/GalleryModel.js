import { DataTypes } from 'sequelize'

const GalleryModel = {
  galleryPath: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  }
}

export default GalleryModel
