import React, { useEffect, useState } from "react";
import "./App.scss";
import List from "./components/List/index.jsx";
import "macro-css";
import axios from "axios";
import Badge from "./components/Badge/index.jsx";
import Tasks from "./components/Tasks/index.jsx";

function App() {
  const [isPopup, setIsPopup] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedColor, setSelectedColor] = useState(1);
  const [colors, setColors] = useState([]);
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/colors").then(({ data }) => {
      setColors(data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/lists?_embed=tasks").then(({ data }) => {
      setFolders(
        data.map((item) => ({
          ...item,
          color:
            colors.find((color) => +color.id === +item.colorId)?.name || "",
        }))
      );
      setIsLoading(false);
    });
  }, [colors]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const addList = () => {
    if (!inputValue) {
      alert("Введите название списка");
      return;
    }
    axios
      .post("http://localhost:3001/lists", {
        name: inputValue,
        colorId: +selectedColor,
      })
      .then(({ data }) => {
        const newFolder = {
          id: data.id,
          name: data.name,
          colorId: data.colorId,
          color:
            colors.find((color) => +color.id === +selectedColor)?.name || "",
        };
        setFolders([...folders, newFolder]);
        setInputValue("");
        setIsPopup(false);
        setSelectedColor(1);
      });
  };

  const addTask = (id, name) => {
    axios
      .post("http://localhost:3001/tasks", {
        text: name,
        listId: id,
        completed: false,
      })
      .then(({ data }) => {
        const newTask = { ...data, completed: false };
        const newFolders = folders.map((folder) => {
          if (folder.id === id) {
            folder.tasks = folder.tasks
              ? [...folder.tasks, newTask]
              : [newTask];
          }
          return folder;
        });
        setFolders(newFolders);
      });
  };

  const removeTask = (taskId, listId) => {
    axios.delete(`http://localhost:3001/tasks/${taskId}`).then(() => {
      const newFolders = folders.map((folder) => {
        if (folder.id === listId) {
          folder.tasks = folder.tasks.filter((task) => task.id !== taskId);
        }
        return folder;
      });
      setFolders(newFolders);
    });
  };
  const completeTask = (folderId, taskId, completed) => {
    const newFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        folder.tasks = folder.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, completed: !completed };
          }
          return task;
        });
      }
      return folder;
    });
    setFolders(newFolders);
  };

  return (
    <div className="toDo">
      <div className="sidebar">
        <div className="logo">
          <img src="img/favicon.svg" width={25} height={25} alt="logo" />
          <h2 className="title">To-do list</h2>
        </div>
        <List
          items={folders}
          isRemovable={true}
          onItemClick={(item) => {
            setActiveItem(item);
          }}
          activeItem={activeItem}
          onRemoveFolder={(item) => {
            const newFolder = folders.filter((folder) => folder.id !== item.id);
            setFolders(newFolder);
          }}
        />
        <List
          onAddClick={() => {
            setIsPopup(!isPopup);
          }}
          className={"addFolderBtn"}
          items={[
            {
              iconURL: "img/plus.svg",
              name: "Добавить папку",
            },
          ]}
        />
        {isPopup && (
          <div className="addFolderPopup">
            <img
              onClick={() => setIsPopup(false)}
              className="cu-p"
              src="img/popupClose.svg"
              alt="Закрыть"
            />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="folderNameInput"
              placeholder="Название папки..."
              type="text"
            />
            <div className="folderColor">
              {colors.map((color) => (
                <Badge
                  onClick={() => {
                    setSelectedColor(color.id);
                  }}
                  key={color.id}
                  color={color.name}
                  className={selectedColor === +color.id ? "active" : ""}
                />
              ))}
            </div>
            <button onClick={addList} className="folderPopupBtn cu-p">
              Добавить
            </button>
          </div>
        )}
      </div>
      {folders && activeItem && (
        <Tasks
          folder={activeItem}
          onEditTitle={(id, title) => {
            const newFolders = folders.map((folder) => {
              if (+folder.id === +id) {
                folder.name = title;
              }
              return folder;
            });
            setFolders(newFolders);
          }}
          onAddTask={(activeId, taskName) => {
            addTask(activeId, taskName);
          }}
          onDeleteTask={(taskId) => {
            removeTask(taskId, activeItem.id);
          }}
          onCompleteTask={(folderId, taskId, completed) => {
            completeTask(folderId, taskId, completed);
          }}
        />
      )}
    </div>
  );
}

export default App;
