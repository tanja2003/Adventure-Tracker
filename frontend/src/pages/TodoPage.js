import { useState, useEffect } from "react";
import { Button, ToggleButton } from "react-bootstrap";
import Select from 'react-select';
import TodoModal from "../Modals/TodoModal";


function ToDoPage(){
  const [todos, setTodos] = useState([]); // array of todo-objects
  const [openTodoStoreModal, setOpenTodoStoreModal] = useState(false);
  const options = [
  { value: "all", label: "Alle" },
  { value: "done", label: "Erledigt" },
  { value: "open", label: "offen" },
  { value: "sunny", label: "Sonniges Wetter"},
  { value: "rainy", label: "Regnerisches Wetter" },
];


  // to see all TODO's at begin
  useEffect(() => { // first render
    const loadTodos = async () => {
      const res = await fetch("http://localhost:5000/api/todos"); // todos from backend
      const data = await res.json(); // change response in JS-object
      setTodos(data); // stores data in todos
    };
    loadTodos();
  }, []);


  const addTodo = async () => {
    setOpenTodoStoreModal(true)
  };


  const deleteTodo = async (id) => {
    console.log("ID: ", id)
    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    });
      if (res.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      } else {
        console.error("Fehler beim Löschen:", await res.text());
      };
    };


  const toggleDone = async (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    setTodos(updatedTodos);
    await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todos.find(t => t.id === id).done })
    });
  };
  const handleChange = (option) =>{
    fetchTodos(option.value); 
  }

  const fetchTodos = async (option) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/todos/${option}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json(); // change response in JS-object
      setTodos(data);
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">📝 TODO Liste</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop:"20px", marginBottom:"15px" }}>  
      <TodoModal show={openTodoStoreModal} onClose={() => {setOpenTodoStoreModal(false);}}
        onSave={(savedTodos) => {setOpenTodoStoreModal(false); fetchTodos()}} >Todo Hinzufügen</TodoModal>
      <Button onClick={addTodo} color="primary" variant="primary">+ Hinzufügen</Button>
       <Select
        defaultValue={options[0]}
        onChange={handleChange}
        name="color"
        options={options}
      />
      </div>
      <ul> 
        {todos.map(todo => ( //list of TODO's
        <div key={todo.id} style={{marginTop: "10px", marginBottom:"10px"}}>
          <ToggleButton
            variant={todo.done ? "success" : "outline-success"}
            size="sm" onClick={() => toggleDone(todo.id)}>
          </ToggleButton>
          <span style={{marginLeft: "20px", marginRight:"20px"}}>{ todo.title}</span>
          <Button variant="danger" size="sm" onClick={() => deleteTodo(todo.id)}>X</Button>
        </div>
      ))}
      </ul>
    </div>
  );
}

export default ToDoPage;