import { useEffect, useState } from 'react';

const useAsync = <T>(func: () => Promise<T>) => {
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    func()
      .then(value => {
        setLoading(false);
        setResult(value);
      })
      .catch(error => {
        setLoading(false);
        setError(error);
      });
  }, []);

  return { result, loading, error };
};

export { useAsync };