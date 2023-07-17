import "./App.css";
import { AppContext } from "./context";
import { Main } from "./components/main";
import { useState, useEffect, useDebounce } from "react";

function App() {
  const [data, setData] = useState("");
  const [sortTodoFlag, setSortTodoFlag] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const valueSearch = searchQuery;

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

  const dispatch = (action) => {
    const { type, id, payload } = action;

    switch (type) {
      case "sort": {
        setSortTodoFlag(!sortTodoFlag);
        break;
      }
      case "createTask": {
        const response = fetch("http://localhost:3005/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const post = response.json();
        setData((prevState) => [...prevState, post]);
        break;
      }
      case "search": {
        setSearchQuery(payload);
        break;
      }
      case "handleUpdate": {
        const postItemIndex = data.findIndex((post) => post.id === id);
        const postItem = data.find((post) => post.id === id);
        if (postItemIndex !== -1) {
          const response = fetch(`http://localhost:3005/todos/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...postItem, title: payload }),
          });
          const updatePost = response.json();
          console.log(updatePost);
          const copyData = data.slice();
          copyData[postItemIndex] = updatePost;
          setData(copyData);
        }
        break;
      }
      case "handleDelete": {
        fetch(`http://localhost:3005/todos/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setData(data.filter((post) => post.id !== id));
        break;
      }
      default:
      //
    }
  };

  return (
    <div>
      <AppContext.Provider value={{ data, dispatch }}>
        <Main />
      </AppContext.Provider>
    </div>
  );
}

export default App;
