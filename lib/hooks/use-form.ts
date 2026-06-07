'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseFormOptions {
  initialValues: Record<string, any>;
  validate?: (values: Record<string, any>) => Record<string, string>;
  onSubmit: (values: Record<string, any>) => Promise<void>;
}

export function useForm({ initialValues, validate, onSubmit }: UseFormOptions) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validate) {
      const fieldErrors = validate({ [name]: values[name] });
      if (fieldErrors[name]) {
        setErrors(prev => ({ ...prev, ...fieldErrors }));
      }
    }
  }, [validate, values]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    setLoading(true);
    try {
      await onSubmit(values);
      router.refresh();
    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  }, [validate, values, onSubmit, router]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setLoading(false);
  }, [initialValues]);

  return {
    values,
    errors,
    loading,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
}
