import { useQuery } from '@tanstack/react-query'

interface PayloadResponse<T> {
  docs: T[]
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

  return useQuery<PayloadResponse<unknown>>({
    queryKey: [endpoint, queryString],
    queryFn: async () => {
      const response = await fetch(`/api/${endpoint}?${queryString}`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })
}
