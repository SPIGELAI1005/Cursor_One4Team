import { useState, useEffect, useCallback } from 'react';

interface FormCacheOptions {
  key: string;
  debounceMs?: number;
  persistToStorage?: boolean;
}

export function useFormCache<T extends Record<string, any>>(
  initialData: T,
  options: FormCacheOptions
) {
  const { key, debounceMs = 500, persistToStorage = true } = options;
  
  const [data, setData] = useState<T>(() => {
    if (persistToStorage && typeof window !== 'undefined') {
      const cached = localStorage.getItem(`form-cache-${key}`);
      if (cached) {
        try {
          return { ...initialData, ...JSON.parse(cached) };
        } catch (error) {
          console.warn('Failed to parse cached form data:', error);
        }
      }
    }
    return initialData;
  });

  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Debounced save function
  const saveToCache = useCallback(
    debounce((formData: T) => {
      if (persistToStorage && typeof window !== 'undefined') {
        try {
          localStorage.setItem(`form-cache-${key}`, JSON.stringify(formData));
          setLastSaved(new Date());
          setIsDirty(false);
        } catch (error) {
          console.warn('Failed to save form data to cache:', error);
        }
      }
    }, debounceMs),
    [key, debounceMs, persistToStorage]
  );

  // Update form data
  const updateData = useCallback((updates: Partial<T>) => {
    const newData = { ...data, ...updates };
    setData(newData);
    setIsDirty(true);
    saveToCache(newData);
  }, [data, saveToCache]);

  // Update specific field
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    updateData({ [field]: value } as Partial<T>);
  }, [updateData]);

  // Clear cache
  const clearCache = useCallback(() => {
    if (persistToStorage && typeof window !== 'undefined') {
      localStorage.removeItem(`form-cache-${key}`);
    }
    setData(initialData);
    setIsDirty(false);
    setLastSaved(null);
  }, [key, persistToStorage, initialData]);

  // Save immediately
  const saveNow = useCallback(() => {
    if (persistToStorage && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`form-cache-${key}`, JSON.stringify(data));
        setLastSaved(new Date());
        setIsDirty(false);
      } catch (error) {
        console.warn('Failed to save form data to cache:', error);
      }
    }
  }, [data, key, persistToStorage]);

  // Auto-save on unmount
  useEffect(() => {
    return () => {
      if (isDirty) {
        saveNow();
      }
    };
  }, [isDirty, saveNow]);

  return {
    data,
    updateData,
    updateField,
    clearCache,
    saveNow,
    isDirty,
    lastSaved,
  };
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 