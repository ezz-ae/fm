"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProfileReveal from '@/components/profile-reveal';
import { StrokeMetrics } from '@/lib/types';

export default function MasNode() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // In a real app, this would fetch from a database or use a session store
    // For this prototype, we'll retrieve from local storage (the "Registry")
    const registryData = localStorage.getItem(`aimas_node_${id}`);
    
    if (!registryData) {
      // If the node doesn't exist or was wiped, it's gone forever
      window.location.href = '/';
      return;
    }

    setData(JSON.parse(registryData));

    // Volatility: Once the data is viewed, the registry entry is scheduled for deletion on refresh
    const handleBeforeUnload = () => {
       localStorage.removeItem(`aimas_node_${id}`);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [id]);

  if (!data) return null;

  return (
    <ProfileReveal 
      handle={data.handle} 
      intensity={data.intensity} 
      userDrawing={data.drawing} 
      metrics={data.metrics}
    />
  );
}
