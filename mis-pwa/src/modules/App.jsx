
import { useEffect, useState } from "react";

import React from 'react';


function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/") // call backend root
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.error("Error connecting to backend:", err));
  }, []);

  return (
  <>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Frontend Connected?</h1>
      <p>{message || "Waiting for backend..."}</p>
    </div>

</>


  );
}

export default App;
