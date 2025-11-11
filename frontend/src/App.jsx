import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "./App.css";
function App() {
  const [ jokes, setjokes ] = useState([]);


  useEffect(() => {
    axios
      .get("/auth/jokes")
      .then((response) => {
        setjokes(response.data);
      })
      .catch((error) => {
        console.log("Error: ", error);
      }); 
  });
  return (
    <>
      <h1>This is vikash Goswami jokes</h1>
      <p>Jokes are {jokes.length}</p>

      {jokes.map((joke, index) => (
        <div key={joke.id}>
          <h2>{joke.jokeContent}</h2>
        </div>
      ))}
      
    </>
  );
}

export default App;
