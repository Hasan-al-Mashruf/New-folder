import React, { useState } from "react";
import "./App.css";
import UserList from "./component/userlist";
const App = () => {
  const [name, setName] = useState("");
  const [loader, setLoader] = useState(false);
  const createUser = async (name) => {
    try {
      setLoader(true);
      const response = await fetch("http://localhost:3000/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (data) {
        setName("");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const handleNewUser = (e) => {
    e.preventDefault();
    if (name.trim()) {
      createUser(name);
    } else {
      alert("Please enter a name.");
    }
  };
  return (
    <div>
      <form onSubmit={(e) => handleNewUser(e)}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <UserList loader={loader} setLoader={setLoader} />
    </div>
  );
};

export default App;
