import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
const UserList = ({ loader, setLoader }) => {
  const [users, setUsers] = useState([]);

  // Fetch users from an API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const { data } = await response.json();
        setUsers(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [loader]);

  useEffect(() => {
    const socket = io("http://localhost:3000/");
    socket.on("userListUpdated", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socket.on("greet", (data) => {
      console.log("hlw2", data);
    });
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users?.map((user) => (
          <ol key={user.id}>
            <strong> Name: </strong>
            {user.name}
          </ol>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
