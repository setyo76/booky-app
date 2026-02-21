// hooks/useAuthors.ts
import { useQuery } from '@tanstack/react-query';
import { getAuthorById, getAuthors } from '@/api/authorsApi';
import { QUERY_KEYS } from '@/constants';

// Karena tidak ada endpoint /authors/{id}, kita perlu alternatif
export function useAuthorDetail(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTHOR_DETAIL, id],
    queryFn: async () => {
      try {
        // Opsi 1: Coba panggil endpoint yang mungkin tidak ada
        // return await getAuthorById(id);
        
        // Opsi 2: Dapatkan dari list authors
        const authorsResponse = await getAuthors({ search: '', limit: 100 });
        const author = authorsResponse?.data?.find(a => a.id === id);
        
        if (!author) {
          throw new Error(`Author with ID ${id} not found`);
        }
        
        return {
          success: true,
          data: author,
          message: 'Success'
        };
      } catch (error) {
        console.error('Error fetching author:', error);
        throw error;
      }
    },
    enabled: !!id && !isNaN(id),
    retry: 1,
  });
}