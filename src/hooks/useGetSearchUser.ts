import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/service";
import { IApiResponseSearchUser } from "@/types";

const useGetSearchUser = () => {
  const data = useMutation<IApiResponseSearchUser, never, string>({
    mutationFn: async (search: string) => {
      const response = await axiosClient.get(`/search/users?q=${search}`);

      return response.data;
    },
  });
  return data;
};

export default useGetSearchUser;
