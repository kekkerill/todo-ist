import axios from "axios";
import "./Tasks.scss";
import { useState } from "react";

export default function Tasks({
  folder,
  onEditTitle,
  onAddTask,
  onDeleteTask,
  onCompleteTask,
}) {
  const [inputValue, setInputValue] = useState("");
  const AddTask = () => {
    setInputValue("");
    onAddTask(folder.id, inputValue);
  };

  const completeTask = (folderId, taskId, completed) => {
    axios.patch(`http://localhost:3001/tasks/${taskId}`, {
      completed: !completed,
    });
    onCompleteTask(folderId, taskId, completed);
  };

  const editTitle = () => {
    const newTitle = window.prompt("Назвние Списка", folder.name);
    if (newTitle) {
      onEditTitle(folder.id, newTitle);
    }
    axios.patch("http://localhost:3001/lists/" + folder.id, {
      name: newTitle,
    });
  };

  return (
    <div className="content">
      <div className="header">
        <h2 className={`title title--${folder.color}`}>{folder.name}</h2>
        <img onClick={editTitle} src="img/edit.svg" alt="edit" />
      </div>
      <div className="line"></div>
      <div className="tasks">
        {!folder.tasks || folder.tasks.length === 0 ? (
          <h2 className="emptyFolder">Задачи отсутствуют</h2>
        ) : (
          folder.tasks.map((task) => (
            <div key={task.id} className="task">
              <div className="checkbox">
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  checked={task.completed}
                  readOnly
                />
                <label
                  htmlFor={`task-${task.id}`}
                  onClick={() =>
                    completeTask(folder.id, task.id, task.completed)
                  }
                >
                  <svg
                    width="11"
                    height="8"
                    viewBox="0 0 11 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.29999 1.20001L3.79999 6.70001L1.29999 4.20001"
                      stroke="none"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </label>
              </div>
              <input readOnly type="text" value={task.text} />
              <img
                onClick={() => {
                  onDeleteTask(task.id);
                }}
                src="img/delete.svg"
                alt="delete"
                className="deleteTask"
              />
            </div>
          ))
        )}
      </div>
      <div className="addTask">
        <input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          placeholder="Назвниае задачи.."
          type="text"
          className="newTaskInput"
          id="newTaskName"
        />
        <button onClick={AddTask} className="newTaskBtn">
          Добавить задачу
        </button>
      </div>
    </div>
  );
}
