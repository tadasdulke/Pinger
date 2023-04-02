import { useMemo, useState, useEffect } from 'react';

const useOnScreen = () => {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() => new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting),
  ), []);

  const initiateObserver = (ref) => {
    observer.observe(ref.current);
  };

  return { isIntersecting, initiateObserver };
};

export default useOnScreen;
