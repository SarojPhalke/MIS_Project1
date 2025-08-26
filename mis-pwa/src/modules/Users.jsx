import { useEffect, useState } from 'react';
import { getUsers } from '../shared/api';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
