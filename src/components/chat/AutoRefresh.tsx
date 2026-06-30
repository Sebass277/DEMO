'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AutoRefresh() {
  const router = useRouter();
  
  useEffect(() => {
    // Refrescar los mensajes cada 3 segundos en segundo plano
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [router]);

  return null;
}
