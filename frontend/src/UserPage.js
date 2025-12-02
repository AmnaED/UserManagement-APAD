import React, { useEffect, useState } from "react";
import UserForm from "./UserForm";

function UserPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from backend
    fetch("http://localhost:5001/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>User Login Page</h1>

      <UserForm
        defaultMessage="New User? Create an Account:"
        buttonMessage="Create Account"
        isNewUser={true}
      />

      <UserForm
        defaultMessage="Returning User? Log In:"
        buttonMessage="Log In"
        isNewUser={false}
      />

      <h2>Existing Users:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>
            {user.name} (ID: {user.user_id})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPage;
