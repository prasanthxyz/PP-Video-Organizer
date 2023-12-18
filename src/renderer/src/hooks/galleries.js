import { useQuery } from 'react-query'
import mainAdapter from '../../../mainAdapter'

export default function useAvailableGalleries() {
  return useQuery('availableGalleries', () => mainAdapter.getAvailableGalleries())
}
