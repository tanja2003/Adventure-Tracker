
import React, { useState, useEffect } from "react";


function ToDoPage(){
// locale states
  const [todos, setTodos] = useState([]); // array of todo-objects
  const [title, setTitle] = useState(""); // text of new task


  // to see all TODO's at begin
  useEffect(() => {  // first render
    fetch("http://localhost:5000/api/todos")  // todos from backend
      .then(res => res.json())  // change response in JS-object
      .then(data => setTodos(data)); // stores data in todos
  }, []);

  const addTodo = () => {
    fetch("http://localhost:5000/api/todos", {
      method: "POST",  // send new task to backend
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }) // sendt title as json
    })
    .then(res => res.json())
    // new array with old and new tasks
    .then(data => setTodos([...todos, { id: data.id, title, done: 0 }]));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">TODO Liste</h1>
      <input 
        value={title} // value of state title
        onChange={(e) => setTitle(e.target.value)} // updates state
        placeholder="Neue Aufgabe" 
      />
      <button onClick={addTodo}>Hinzufügen</button>
      <ul> 
        {todos.map(todo => ( //list of TODO's
          <li key={todo.id}>{todo.title} {todo.done ? "(Erledigt)" : ""}</li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoPage;