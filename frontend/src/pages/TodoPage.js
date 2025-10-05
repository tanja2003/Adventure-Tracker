
import { useState, useEffect } from "react";
import { Button, ToggleButton } from "react-bootstrap";
import Select, { AriaOnFocus } from 'react-select';
import TodoModal from "../Modals/TodoModal";


function ToDoPage(){
// locale states
  const [todos, setTodos] = useState([]); // array of todo-objects
  const [title, setTitle] = useState(""); // text of new task
  const [filter, setFilter] = useState("all")
  const [wheaterFilter, setWheaterFilter] = useState("both")
  const [openTodoStoreModal, setOpenTodoStoreModal] = useState(false);
  const options = [
  { value: "all", label: "Alle" },
  { value: "done", label: "Erledigt" },
  { value: "open", label: "offen" },
  { value: "sunny", label: "Sonniges Wetter"},
  { value: "rainy", label: "Regnerisches Wetter" },
];
const wheaterOptions = [
  { value: "sunny", label: "Sonniges Wetter"},
  { value: "rainy", label: "Regnerisches Wetter"},
  { value: "both", label: "Immer möglich"},
]


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
    //const res = await fetch("http://localhost:5000/api/todos", {
    //  method: "POST",  // send new task to backend
    //  headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ title, wheaterFilter }) // sendt title as json
    //});
    //const data = await res.json();
    //// new array with old and new tasks
    //setTodos([...todos, { id: data.id, title, done: 0 }]);
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
    setFilter(option.value);
    fetchTodos(option.value); 
  }

  const fetchTodos = async (option) => {
    console.log("Option:", option)

    const res = await fetch(`http://localhost:5000/api/todos/${option}`)
    const data = await res.json(); // change response in JS-object
      setTodos(data);

      console.log("Data", data)
  }

  const handleWheaterChange = (option) => {
    setWheaterFilter(option.value)

  }



  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">TODO Liste</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>  
      <TodoModal show={openTodoStoreModal} onClose={() => {setOpenTodoStoreModal(false);}}
        onSave={(savedTodos) => {setOpenTodoStoreModal(false)}}>Todo Hinzufügen</TodoModal>
      <Button onClick={addTodo} color="primary">+ Hinzufügen</Button>
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