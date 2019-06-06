import { useMemo, useEffect } from 'react';

export default function useDocumentTitle(title: string) {
  const originalTitle = useMemo(() => document.title, []);
  useEffect(() => {
    document.title = title;
    return () => (document.title = originalTitle);
  })
}