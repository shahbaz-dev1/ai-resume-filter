import { useState } from 'react';
import { Box, Button, Input, Field, Text } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/layout';
import axios from 'axios';

/**
 * EditProfileForm allows the user to update their name.
 */
export default function EditProfileForm({ currentName, onProfileUpdated }: { currentName: string; onProfileUpdated: (name: string) => void }) {
  const [name, setName] = useState(currentName);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      await axios.post('/users/update', { name }, {
        baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg('Profile updated!');
      onProfileUpdated(name);
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={8} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
      <form onSubmit={handleUpdateProfile}>
        <VStack spacing={4}>
          <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </Field.Root>
          {msg && <Text color={msg.includes('updated') ? 'green.500' : 'red.500'} fontSize="sm">{msg}</Text>}
          <Button colorScheme="blue" type="submit" loading={loading}>Update Profile</Button>
        </VStack>
      </form>
    </Box>
  );
} 