import { useEffect, useState } from 'react';
import userService, { User } from './services/user-service';
import { CanceledError } from './services/api-client';

function App() {
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

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = {
      id: 6677,
      name: 'xyz',
    };
    setUsers([newUser, ...users]);

    userService
      .create(newUser)
      .then((res) => setUsers([res.data, ...users]))
      .catch((error) => {
        setUsers(originalUsers);
        setError(error.message);
      });
  };

  const editUser = (user: User) => {
    const originalUsers = [...users];
    const updatedUser = {
      ...user,
      name: 'ankit',
    };

    setUsers(users.map((val) => (val.id === user.id ? updatedUser : val)));

    userService.update(user).catch((error) => {
      setUsers(originalUsers);
      setError(error.message);
    });
  };

  const deleteUser = (user: User) => {
    const originalUsers = [...users];

    setUsers(users.filter((val) => val.id !== user.id));
    userService.delete(user).catch((error) => {
      setUsers(originalUsers);
      setError(error.message);
    });
  };

  return (
    <div className="App">
      <button onClick={addUser}>Add user</button>
      {error && <p>{error}</p>}
      {users.map((val) => (
        <div className="item" key={val.id}>
          <div>{val.name}</div>
          <div className="actions">
            <button onClick={() => editUser(val)}>Edit</button>
            <button onClick={() => deleteUser(val)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
