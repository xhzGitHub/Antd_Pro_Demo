import { useState, useEffect } from 'react';

export const useFetchData = (service, query = '', dependencies) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    fetchData();
  }, dependencies);

  return [data, isLoading];
};
