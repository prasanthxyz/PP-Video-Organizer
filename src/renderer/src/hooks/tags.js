import { useQuery } from 'react-query'
import mainAdapter from '../../../mainAdapter'

export default function useAvailableTags() {
  return useQuery('availableTags', () => mainAdapter.getAvailableTags())
}
