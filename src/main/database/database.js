import { Sequelize } from 'sequelize'
import GalleryModel from './GalleryModel'
import TagModel from './TagModel'
import VideoModel from './VideoModel'

let sequelize = null
export let Tag = null
export let Gallery = null
export let Video = null

export const setupDB = async () => {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'pvorg.db'
  })

  createTables()

  console.log('Syncing DB...')
  await sequelize.sync()
}

export const getDB = async () => {
  if (sequelize === null) await setupDB()
  return sequelize
}

const createTables = () => {
  Tag = sequelize.define('Tag', TagModel)
  Gallery = sequelize.define('Gallery', GalleryModel)
  Video = sequelize.define('Video', VideoModel)
  Video.belongsToMany(Gallery, { through: 'VideoGallery' })
  Video.belongsToMany(Tag, { through: 'VideoTag' })
}
