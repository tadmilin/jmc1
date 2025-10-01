import { useQuery } from '@tanstack/react-query'
import type { ICatalog } from '@/collections/Catalogs'

interface CatalogsResponse {
  docs: ICatalog[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

interface FetchParams {
  limit?: number
  page?: number
  sort?: string
}

export const usePayloadAPI = (endpoint: string, params: FetchParams = {}) => {
  const queryString = new URLSearchParams({
    limit: params.limit?.toString() || '10',
    page: params.page?.toString() || '1',
    sort: params.sort || '-createdAt',
  }).toString()

  return useQuery<CatalogsResponse>({
    queryKey: [endpoint, queryString],
    queryFn: async () => {
      const response = await fetch(`/api/${endpoint}?${queryString}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })
}
