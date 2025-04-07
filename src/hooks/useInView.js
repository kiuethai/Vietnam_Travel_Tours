import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect if an element is in viewport
 * @param {Object} options - IntersectionObserver options
 * @param {Number} options.threshold - A number between 0 and 1 indicating the percentage that should be visible
 * @param {String|Element} options.root - The element that is used as the viewport for checking visibility
 * @param {String} options.rootMargin - Margin around the root
 * @returns {Array} [ref, isInView] - ref to attach to the element and boolean if the element is in view
 */
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [ref, options]);

  return [ref, isInView];
};

export default useInView;
