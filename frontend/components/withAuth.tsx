import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * HOC to protect pages. Redirects to /login if not authenticated.
 */
export function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    useEffect(() => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.replace('/login');
      } else {
        setChecked(true);
      }
    }, [router]);
    if (!checked) return null;
    return <WrappedComponent {...(props as any)} />;
  };
} 