import { useQuery } from 'react-query'
import mainAdapter from '../../../mainAdapter'

export function useAvailableTags() {
  return useQuery('availableTags', () => mainAdapter.getAvailableTags())
}

export function useAllTags() {
  return useQuery('allTags', () => mainAdapter.getAllTags())
}
