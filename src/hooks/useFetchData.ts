import { useState, useEffect } from 'react';

export const useFetchData = (
  service: (params: any) => void,
  query: any = '',
  dependencies: any
) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await service(query);
      setIsLoading(false);
      setData(res);
    } catch (error) {
      setIsLoading(false);
      console.log(`fetchData fail: ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return [data, isLoading];
};
