import { useState } from 'react';
import { Box, Button, Input, Field, Text } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/layout';
import axios from 'axios';

/**
 * ChangePasswordForm allows the user to change their password.
 */
export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      await axios.post('/users/change-password', { oldPassword, newPassword }, {
        baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={8} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
      <form onSubmit={handleChangePassword}>
        <VStack spacing={4}>
          <Field.Root>
            <Field.Label>Old Password</Field.Label>
            <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
          </Field.Root>
          <Field.Root>
            <Field.Label>New Password</Field.Label>
            <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </Field.Root>
          {msg && <Text color={msg.includes('success') ? 'green.500' : 'red.500'} fontSize="sm">{msg}</Text>}
          <Button colorScheme="blue" type="submit" loading={loading}>Change Password</Button>
        </VStack>
      </form>
    </Box>
  );
} 