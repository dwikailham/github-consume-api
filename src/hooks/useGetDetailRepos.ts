import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/service";
import { TDetailRepos } from "@/types";

const useGetDetailRepos = () => {
  const data = useMutation<Array<TDetailRepos>, never, string>({
    mutationFn: async (userName: string) => {
      const response = await axiosClient.get(`/users/${userName}/repos`);

      return response.data;
    },
  });
  return data;
};

export default useGetDetailRepos;
