import { Box, Flex, Button, Link, Spacer, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Navbar component with navigation and logout. Shows admin links if user is admin.
 */
export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (token) {
      axios.get('/users/me', { baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000', headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <Box bg="blue.600" px={4} py={3} color="white" mb={8} boxShadow="md">
      <Flex align="center">
        <NextLink href="/vector" passHref legacyBehavior>
          <Link fontWeight="bold" fontSize="lg" mr={6} _hover={{ textDecoration: 'none', color: 'blue.200' }}>Vector</Link>
        </NextLink>
        <NextLink href="/profile" passHref legacyBehavior>
          <Link fontWeight="bold" fontSize="lg" mr={6} _hover={{ textDecoration: 'none', color: 'blue.200' }}>Profile</Link>
        </NextLink>
        {/* Admin links */}
        {user?.role === 'admin' && (
          <>
            <NextLink href="/admin/users" passHref legacyBehavior>
              <Link fontWeight="bold" fontSize="lg" mr={6} _hover={{ textDecoration: 'none', color: 'yellow.200' }}>Admin Users</Link>
            </NextLink>
            <NextLink href="/admin/activity" passHref legacyBehavior>
              <Link fontWeight="bold" fontSize="lg" mr={6} _hover={{ textDecoration: 'none', color: 'yellow.200' }}>Admin Activity</Link>
            </NextLink>
          </>
        )}
        <Spacer />
        {user && <Text mr={4}>Hello, {user.name || user.email}</Text>}
        <Button colorScheme="red" variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
      </Flex>
    </Box>
  );
} 