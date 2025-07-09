import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Input, Heading, Field } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/layout';
import { Alert } from '@chakra-ui/alert';
import { login } from '../lib/api';

/**
 * Login page for user authentication.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.access_token);
      router.push('/vector');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6}>Login</Heading>
      <form onSubmit={handleLogin}>
        <VStack spacing={4} align="stretch">
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </Field.Root>
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </Field.Root>
          {error && <Alert status="error">{error}</Alert>}
          <Button colorScheme="blue" type="submit">Login</Button>
        </VStack>
      </form>
    </Box>
  );
} 