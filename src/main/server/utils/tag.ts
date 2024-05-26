import { ITagModel } from '../../../types'
import * as dataUtils from './data'

export function getTags(): ITagModel[] {
  return dataUtils.data.tags.map((tt) => ({
    title: tt
  }))
}
