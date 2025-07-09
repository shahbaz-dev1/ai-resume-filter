import { useEffect, useState } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';

/**
 * ActivityLog component displays the user's activity log in a table.
 */
export default function ActivityLog() {
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
      const res = await axios.get('/users/activity', {
        baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000',
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err: any) {
      setError('Failed to fetch activity log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={8}>
      <Heading size="md" mb={4}>Activity Log</Heading>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : logs.length === 0 ? (
        <Text>No activity found.</Text>
      ) : (
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Action</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {logs.map((log, idx) => (
              <Tr key={idx}>
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