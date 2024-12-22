import { useQuery } from "@tanstack/react-query";
import { TxtFileSearchBy, txtFilesService } from "../services/txt-files.service";

export function useTxtFiles({
  searchBy,
  query,
}: { searchBy: TxtFileSearchBy|undefined, query: string; }) {
  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["txtFiles"],
    queryFn: async () => await txtFilesService.getTxtFiles(searchBy, query),
    select: (data) => data?.data,
    placeholderData: (previousData) => previousData,
    retry: 1,
    retryDelay: 1000,
    throwOnError: true,
  });
  return { isPending, data, error, refetch };
};