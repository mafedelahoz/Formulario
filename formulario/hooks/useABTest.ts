'use client';

import { useState, useEffect } from 'react';

type Variant = 'A' | 'B';

const STORAGE_KEY = 'ab_test_variant';

export function useABTest(): Variant | null {
  const [variant, setVariant] = useState<Variant | null>(null);

  useEffect(() => {
    const storedVariant = localStorage.getItem(STORAGE_KEY) as Variant | null;
    
    if (storedVariant && (storedVariant === 'A' || storedVariant === 'B')) {
      setVariant(storedVariant);
    } else {
      const randomVariant = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem(STORAGE_KEY, randomVariant);
      setVariant(randomVariant);
    }
  }, []);

  return variant;
}
