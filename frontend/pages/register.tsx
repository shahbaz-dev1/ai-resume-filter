import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Input, Heading, Field } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/layout';
import { register, login } from '../lib/api';

/**
 * Registration page for new users.
 */
export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
      // Auto-login after registration
      const data = await login(email, password);
      localStorage.setItem('token', data.access_token);
      router.push('/vector');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6}>Register</Heading>
      <form onSubmit={handleRegister}>
        <VStack spacing={4} align="stretch">
          <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </Field.Root>
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </Field.Root>
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </Field.Root>
          {error && <Box color="red.500" fontSize="sm">{error}</Box>}
          <Button colorScheme="blue" type="submit" loading={loading}>Register</Button>
        </VStack>
      </form>
    </Box>
  );
} 