import { DataTypes } from 'sequelize'

const TagModel = {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  }
}

export default TagModel
