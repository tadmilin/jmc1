import { useQuery } from '@tanstack/react-query'
import { ICatalog } from '../collections/Catalogs'

export const useCatalogs = () => {
  return useQuery<ICatalog[]>({
    queryKey: ['catalogs'],
    queryFn: async () => {
      const response = await fetch('/api/catalogs')
      if (!response.ok) {
        throw new Error('Failed to fetch catalogs')
      }
      return response.json()
    },
  })
}
