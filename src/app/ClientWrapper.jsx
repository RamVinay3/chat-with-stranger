'use client'; // ✅ this is client component

import { useSocketStore } from '@/sockets/socketStore';
import { useEffect } from 'react';


export default function ClientWrapper({ children }) {
  const connect = useSocketStore((state) => state.connect);

  useEffect(() => {
    connect(); 
  }, []);

  return children;
}
