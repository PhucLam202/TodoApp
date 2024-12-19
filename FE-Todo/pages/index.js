import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdEdit, MdDelete, MdConfirmationNumber } from "react-icons/md"
import { format } from "date-fns"


const index = () => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [editText, setEditText] = useState("");
  const [todosCopy, setTodosCopy] = useState(todos);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);


  //State manament
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState(search);



  useEffect(() => {
    fetchTodos();
  },[]);

  const editTodo = (index) => {
    if (todos[index]) {
      setTodoInput(todos[index].title);
      setEditIndex(index);
    } else {
      console.error("Invalid index:", index);
    }
  }

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/GetAllTodos");
      setTodos(response.data);
      setTodosCopy(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  const addTodo = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/CreateTodo`, { title: todoInput, completed: false });
      console.log(response.data);
      setTodos(response.data);
      setTodosCopy(response.data);
      setTodoInput("");
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  const updateTodo = async () => {
    try {
      const todoIndex = editIndex;
      if (todoIndex === -1) {
        console.error("Todo not found:", todoIndex);
        return;
      }
      const dataUpdate = { ...todos[todoIndex], title: todoInput };
      const response = await axios.put(`http://localhost:8080/api/v1/UpdateTodo/${dataUpdate.id}`, dataUpdate);
      console.log(response.data);
      const UpdateTodos = [...todos];
      UpdateTodos[todoIndex] = response.data;
      setTodos(UpdateTodos);
      setTodoInput("");
      setEditIndex(-1);
      setCount(count + 1);
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  const handleTodo = () => {
    if (editIndex === -1) {
      addTodo();
    } else {
      updateTodo();
    }
  }

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/DeleteTodo/${id}`);
      console.log(response.data);
      setTodos(todos.filter(todo => todo.id !== id));
      setTodosCopy(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  const ToggleCompleted = async (id) => {
    try {
      const todoToUpdate = {
        ...todos[index], 
        completed: !todos[index].completed
      }
      const response = await axios.put(`http://localhost:8080/api/v1/UpdateTodo/${id}`, todoToUpdate);
      console.log(response.data);
      const UpdateTodos = [...todos];
      UpdateTodos[index] = response.data;
      setTodos(UpdateTodos);
      setCount(count + 1);editTodo
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  //Filter
  const onHandleFilter = (value) => {
    const filterTodos = todosCopy.filter((todo) => 
      todo.title.toLowerCase().includes(value.toLowerCase())
    );
    setTodos(filterTodos);
  }
  const onClear = () => {
    if (searchInput.length && todosCopy.length) {
      setTodos(todosCopy);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onHandleFilter(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (search) {
      onHandleSearch();
    }
    else {
      onHandleFilter();
    }
  }, [search]);
  const RenderTodos = (todos) => {
    return todos.map((todo, index) => (
      <li key={todo.id} className="todo-item">
        <span className="todo-text">{todo.title}</span>
        <div className="todo-actions">
          <button onClick={() => editTodo(index)} className="edit-btn">
            <MdEdit size={20} />
          </button>
          <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
            <MdDelete size={20} />
          </button>
        </div>
        <small className="todo-date">
          {new Date(todo.created_at).toLocaleDateString()}
        </small>
      </li>
    ));
  };

  return (
    <div className="main">
      <div className="todo-app">
        <div className="input-section">
          <input type="text" id="todoInput" placeholder="Add a todo" value={todoInput} onChange={(e) => setTodoInput(e.target.value)} />
          <button onClick={() => handleTodo()} className="add">{editIndex !== -1 ? "Update" : "Add"}</button>
          <input 
            type="text" 
            id="search-input" 
            placeholder="Search a todo" 
            value={searchInput} 
            onChange={(e) => setSearchInput(e.target.value)} 
          />
          <button onClick={() => setSearchInput("")}>Clear</button>
        </div>
        {/*Body List */}
        <ul className="todo-list">
          {RenderTodos(todos)}
        </ul>
      </div>
    </div>
  );
}

export default index;