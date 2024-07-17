import "./List.scss";
import classNames from "classnames";
import Badge from "../Badge";
import axios from "axios";
function List({
  onAddClick,
  className,
  items,
  isRemovable,
  onRemoveFolder,
  onItemClick,
  activeItem,
}) {
  const onRemove = (item) => {
    if (window.confirm("Действительно удалить папку?")) {
      axios.delete("http://localhost:3001/lists/" + item.id).then(() => {
        onRemoveFolder(item);
      });
    }
  };
  return (
    <ul onClick={onAddClick} className="sidebarList">
      {items.map((item, index) => (
        <li
          onClick={
            onItemClick
              ? () => {
                  onItemClick(item);
                }
              : null
          }
          key={index}
          className={classNames(className, {
            active: activeItem && +activeItem.id === +item.id,
          })}
        >
          <div>
            {item.iconURL ? (
              <i>
                <img src={item.iconURL} alt="list icon" />
              </i>
            ) : (
              <Badge color={item.color}></Badge>
            )}
            {item.name}{" "}
            <span>
              {item.tasks && item.tasks.length >= 0 && `(${item.tasks.length})`}
            </span>
          </div>
          {isRemovable && (
            <img
              onClick={() => {
                onRemove(item);
              }}
              src="img/delete.svg"
              className="deleteBtn"
              alt="delete"
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export default List;
