import { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { withAuth } from '../components/withAuth';
import ChangePasswordForm from '../components/ChangePasswordForm';
import EditProfileForm from '../components/EditProfileForm';
import ActivityLog from '../components/ActivityLog';

/**
 * Profile page to display and edit current user's info.
 */
function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const fetchUser = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (token) {
      axios.get('/users/me', { baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000', headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  const handleProfileUpdated = (name: string) => {
    setUser((u: any) => ({ ...u, name }));
  };

  if (loading) return <Box mt={20} textAlign="center"><Spinner /></Box>;
  if (!user) return <Box mt={20} textAlign="center">Not logged in.</Box>;

  return (
    <Box maxW="md" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={4}>Profile</Heading>
      <Text><b>Name:</b> {user.name}</Text>
      <Text><b>Email:</b> {user.email}</Text>
      <Text><b>Role:</b> {user.role}</Text>
      <EditProfileForm currentName={user.name} onProfileUpdated={handleProfileUpdated} />
      <ChangePasswordForm />
      <ActivityLog />
    </Box>
  );
}

export default withAuth(ProfilePage); 