import { useEffect, useState } from "react";
import { useDebounce } from "./usehooks";
import { Main } from "./main";
import { AppContext } from "./context";

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const valueSearch = useDebounce(searchQuery, 2000);

  const handleSearchQuery = ({ target }) => {
    setSearchQuery(target.value);
  };
  const [sortTodoFlag, setSortTodoFlag] = useState(false);
  const sortTodos = () => {
    setSortTodoFlag(!sortTodoFlag);
  };

  useEffect(() => {
    fetch(
      sortTodoFlag
        ? `http://localhost:3005/todos?q=${valueSearch}`
        : `http://localhost:3005/todos?_sort=title&_order=asc`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, [valueSearch, sortTodoFlag]);

  const createTask = async (payload) => {
    const response = await fetch("http://localhost:3005/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const post = await response.json();
    setData((prevState) => [...prevState, post]);
  };
  const removeTask = async (id) => {
    await fetch(`http://localhost:3005/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setData(data.filter((post) => post.id !== id));
  };
  const updatePost = async (id, payload) => {
    const postItemIndex = data.findIndex((post) => post.id === id);
    const postItem = data.find((post) => post.id === id);
    if (postItemIndex !== -1) {
      const response = await fetch(`http://localhost:3005/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...postItem, title: payload }),
      });
      const updatePost = await response.json();

      const copyData = data.slice();
      copyData[postItemIndex] = updatePost;
      setData(copyData);
    }
  };

  return (
    <div>
      <AppContext.Provider
        value={{
          data,
          searchQuery,
          handleSearchQuery,
          sortTodos,
          removeTask,
          updatePost,
          createTask,
        }}
      >
        <Main />
      </AppContext.Provider>
    </div>
  );
}

export default App;
