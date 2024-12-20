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
  const [labelInput, setLabelInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);



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
      const todoData = {
        title: todoInput,
        completed: false,
      };

      // Chỉ thêm các trường nếu chúng có giá trị
      if (labelInput) {
        todoData.label = labelInput;
      }
      if (statusInput) {
        todoData.status = statusInput;
      }
      if (priorityInput) {
        todoData.priority = priorityInput;
      }

      const response = await axios.post(`http://localhost:8080/api/v1/CreateTodo`, todoData);
      console.log("add", response.data);
      setTodos([...todos, response.data]);
      setTodosCopy([...todosCopy, response.data]);
      setTodoInput("");
      setLabelInput("");
      setStatusInput("");
      setPriorityInput("");
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const updateTodo = async () => {
    try {
      const todoIndex = editIndex;
      if (todoIndex === -1) {
        console.error("Todo not found:", todoIndex);
        return;
      }
      const dataUpdate = {
        ...todos[todoIndex],
        title: todoInput,
        label: labelInput,
        status: statusInput,
        priority: priorityInput,
      };
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
        <div className="todo-main-content">
          <span className="todo-text">{todo.title}</span>
          {(todo.status || todo.priority || todo.label) && (
            <div className="todo-details">
              {todo.status && (
                <span className="todo-tag status">{todo.status}</span>
              )}
              {todo.priority && (
                <span className="todo-tag priority">{todo.priority}</span>
              )}
              {todo.label && (
                <span className="todo-tag label">{todo.label}</span>
              )}
            </div>
          )}
        </div>
        <div className="todo-right">
          <div className="todo-actions">
            <button onClick={() => editTodo(index)} className="edit-btn">
              <MdEdit size={18} />
            </button>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
              <MdDelete size={18} />
            </button>
          </div>
          {todo.created_at && (
            <small className="todo-date">
              {new Date(todo.created_at).toLocaleDateString()}
            </small>
          )}
        </div>
      </li>
    ));
  };

  return (
    <div className="main">
      <div className="todo-app">
        <div className="input-section">
          <div className="input-container">
            <input
              type="text"
              id="todoInput"
              placeholder="Add a todo"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
            />
            <span className="dropdown-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
              ▼
            </span>
          </div>
          <button onClick={() => handleTodo()} className="add">
            {editIndex !== -1 ? "Update" : "Add"}
          </button>
          <input
            type="text"
            id="search-input"
            placeholder="Search a todo"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={() => setSearchInput("")}>Clear</button>
        </div>
        {dropdownOpen && (
          <div className="dropdowns">
            <select value={labelInput} onChange={(e) => setLabelInput(e.target.value)}>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Others">Others</option>
            </select>
            <select value={statusInput} onChange={(e) => setStatusInput(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)}>
              <option value="">Select Priority</option>
              <option value="VeryLow">Very Low</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="VeryHigh">Very High</option>
            </select>
          </div>
        )}
        {/*Body List */}
        <ul className="todo-list">
          {RenderTodos(todos)}
        </ul>
      </div>
    </div>
  );
}

export default index;