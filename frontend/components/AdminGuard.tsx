import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

/**
 * HOC to protect admin pages. Redirects to /login if not admin.
 */
export function withAdmin<P>(WrappedComponent: React.ComponentType<P>) {
  return function AdminProtectedComponent(props: P) {
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.replace('/login');
        return;
      }
      axios.get('/users/me', {
        baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (res.data.role !== 'admin') {
            router.replace('/login');
          } else {
            setChecked(true);
          }
        })
        .catch(() => router.replace('/login'));
    }, [router]);
    if (!checked) return null;
    return <WrappedComponent {...(props as any)} />;
  };
} 