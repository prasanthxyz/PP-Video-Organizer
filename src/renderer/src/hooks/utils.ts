import { UseQueryResult, useQuery } from 'react-query'
import bi from '../../../backend_interface'

const QUERIES = {
  fetchExecutablesStatus: async (): Promise<boolean[]> =>
    fetch(`${bi.SERVER_URL}/${bi.GET_EXECUTABLES_STATUS}`).then((res) => res.json())
}

export function useExecutablesStatus(): UseQueryResult<boolean[], unknown> {
  return useQuery('executablesStatus', QUERIES.fetchExecutablesStatus, {
    staleTime: Infinity
  })
}
