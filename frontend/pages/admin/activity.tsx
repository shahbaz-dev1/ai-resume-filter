import { useEffect, useState } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import { withAdmin } from '../../components/AdminGuard';

/**
 * Admin activity log page. Shows all user activities.
 */
function AdminActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const res = await axios.get('/users/activity/all', {
        baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000',
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err: any) {
      setError('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="4xl" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6}>All Activity Logs</Heading>
      {loading ? <Spinner /> : error ? (
        <Text color="red.500">{error}</Text>
      ) : logs.length === 0 ? (
        <Text>No activity found.</Text>
      ) : (
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>User ID</Th>
              <Th>Action</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {logs.map((log, idx) => (
              <Tr key={idx}>
                <Td>{log.userId}</Td>
                <Td>{log.action}</Td>
                <Td>{new Date(log.timestamp).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}

export default withAdmin(AdminActivityPage); 