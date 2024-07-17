import "./Badge.scss";
function Badge({ onClick, color, className }) {
  return (
    <i onClick={onClick} className={`badge badge--${color} ${className}`}></i>
  );
}
export default Badge;
