import { useEffect, useState } from 'react';
import { fetchUsers } from '../api/jiraApi';
import type { JiraUsers } from '../types/jira';

export const useUsers = () => {
  const [users, setUsers] = useState<JiraUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return { users, loading, error };
};