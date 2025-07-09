import { useEffect, useState } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import { withAdmin } from '../../components/AdminGuard';

/**
 * Admin user management page. List, promote/demote, delete users.
 */
function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setMsg('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const res = await axios.get('/users', {
        baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000',
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err: any) {
      setMsg('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (id: number, toRole: 'admin' | 'user') => {
    setMsg('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      await axios.post('/admin/promote', { id, role: toRole }, {
        baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg('Role updated!');
      fetchUsers();
    } catch (err: any) {
      setMsg('Failed to update role');
    }
  };

  const handleDelete = async (id: number) => {
    setMsg('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      await axios.post('/admin/delete', { id }, {
        baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg('User deleted!');
      fetchUsers();
    } catch (err: any) {
      setMsg('Failed to delete user');
    }
  };

  return (
    <Box maxW="4xl" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6}>User Management</Heading>
      {loading ? <Spinner /> : (
        <>
          {msg && <Text color={msg.includes('!') ? 'green.500' : 'red.500'} mb={2}>{msg}</Text>}
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <Button size="xs" colorScheme={user.role === 'admin' ? 'yellow' : 'blue'} mr={2} onClick={() => handlePromote(user.id, user.role === 'admin' ? 'user' : 'admin')}>
                      {user.role === 'admin' ? 'Demote' : 'Promote'}
                    </Button>
                    <Button size="xs" colorScheme="red" onClick={() => handleDelete(user.id)}>
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
    </Box>
  );
}

export default withAdmin(AdminUsersPage); 