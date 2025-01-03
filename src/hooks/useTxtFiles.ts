import { useQuery } from "@tanstack/react-query";
import { txtFilesService } from "../services/txt-files.service";
import { TxtFileSearchBy } from "../types/txt-files";

export function useTxtFiles({
  searchBy,
  query,
}: { searchBy: TxtFileSearchBy | undefined, query: string; }) {
  const { isFetching, isSuccess, data, error, refetch } = useQuery({
    queryKey: ["txtFiles"],
    queryFn: async () => await txtFilesService.getTxtFiles(searchBy, query),
    select: (data) => data?.data,
    placeholderData: (previousData) => previousData,
    retry: 1,
    retryDelay: 1000,
    throwOnError: true,
  });
  return { isFetching, isSuccess, data, error, refetch };
};