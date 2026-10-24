import { useState, useEffect, useCallback } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error al obtener datos:', err); //Se agrega un console.error para depuración
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Re-run effect if fetchData changes which change only if url changes

  return { data, loading, error, fetchData };
};

export default useFetch;
