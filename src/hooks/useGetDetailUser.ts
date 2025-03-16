import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/service";
import { TDetailUser } from "@/types";

const useGetDetailUser = () => {
  const data = useMutation<TDetailUser, never, string>({
    mutationFn: async (userName: string) => {
      const response = await axiosClient.get(`/users/${userName}`);

      return response.data;
    },
  });
  return data;
};

export default useGetDetailUser;
