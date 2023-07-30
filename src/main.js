import { AppContext } from "./context";
import { PostItem } from "./PostItem";
import { useContext, useState } from "react";

export const Main = () => {
  const {
    data,
    searchQuery,
    handleSearchQuery,
    sortTodos,
    removeTask,
    updatePost,
    createTask,
  } = useContext(AppContext);
  return (
    <>
      <input
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearchQuery}
      />
      <button onClick={sortTodos}>Сортировать</button>
      <ul>
        {data.length > 0 ? (
          <div>
            {data.map((post) => (
              <PostItem
                key={post.id}
                {...post}
                handleDelete={removeTask}
                handleUpdate={updatePost}
              />
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
    </>
  );
};
