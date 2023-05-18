import { CanceledError } from '../services/api-client';
import { useState, useEffect } from 'react';
import userService, { User } from '../services/user-service';

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const { request, cancel } = userService.getAll<User>();

    request
      .then((res) => setUsers(res.data))
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
      });

    return () => cancel();
  }, []);

  return {
    users,
    error,
    setUsers,
    setError,
  };
}

export default useUsers;
