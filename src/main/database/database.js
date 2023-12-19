import * as path from 'path'
import { Sequelize } from 'sequelize'
import GalleryModel from './GalleryModel'
import TagModel from './TagModel'
import VideoModel from './VideoModel'

let sequelize = null
export let Tag = null
export let Gallery = null
export let Video = null

export async function setupDB(app) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(app.getPath('home'), 'pvorg.db'),
    logging: false
  })

  createTables()

  console.log('Syncing DB...')
  await sequelize.sync()
}

function createTables() {
  Tag = sequelize.define('Tag', TagModel)
  Gallery = sequelize.define('Gallery', GalleryModel)
  Video = sequelize.define('Video', VideoModel)
  Video.belongsToMany(Gallery, { through: 'VideoGallery' })
  Gallery.belongsToMany(Video, { through: 'VideoGallery' })
  Video.belongsToMany(Tag, { through: 'VideoTag' })
  Tag.belongsToMany(Video, { through: 'VideoTag' })
}
