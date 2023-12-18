import { useQuery } from 'react-query'
import mainAdapter from '../../../mainAdapter'

export default function useAvailableVideos() {
  return useQuery('availableVideos', () => mainAdapter.getAvailableVideos())
}
