import { useContext, useState } from "react";
import { AppContext } from "../context";
import { PostItem } from "../PostItem";

export const Main = () => {
  const { data, dispatch } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const sortTodos = () => {
    dispatch({ type: "sort" });
  };
  const createTask = (title, completed) => {
    dispatch({ type: "createTask", payload: (title, completed) });
  };
  const handleSearchQuery = ({ target }) => {
    dispatch({ type: "search", payload: target.value });
    setSearchQuery(target.value);
  };

  return (
    <div>
      <input
        placeholder="search"
        value={searchQuery}
        onChange={handleSearchQuery}
      />
      <button onClick={sortTodos}>Сортировать</button>
      <ul>
        {data.length > 0 ? (
          <div>
            {data.map((post) => (
              <PostItem key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <h1>Постов нет</h1>
        )}
      </ul>
      <button
        onClick={() =>
          createTask({
            title: "Новая заметка",
            completed: false,
          })
        }
      >
        Отправить Пост
      </button>
    </div>
  );
};
