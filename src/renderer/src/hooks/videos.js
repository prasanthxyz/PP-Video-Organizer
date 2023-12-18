import { useQuery } from 'react-query'
import mainAdapter from '../../../mainAdapter'

export function useAvailableVideos() {
  return useQuery('availableVideos', () => mainAdapter.getAvailableVideos())
}

export function useAllVideos() {
  return useQuery('allVideos', () => mainAdapter.getAllVideos())
}
