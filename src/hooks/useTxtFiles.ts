import { useQuery } from "@tanstack/react-query";
import { txtFilesService } from "../services/txt-files.service";

export function useTxtFiles() {
  const { isPending, data, error, refetch } = useQuery({
        queryKey: ["txtFiles"],
        queryFn: async () => await txtFilesService.getTxtFiles(),
        select: (data) => data?.data,
        placeholderData: (previousData) => previousData,
        retry: 1,
        retryDelay: 1000,
        throwOnError: true,
    });
    return { isPending, data, error, refetch };
};