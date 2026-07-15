import "./Toast.css";

function Toast({ message, type = "success" }) {

    if (!message) return null;

    return (
        <div className={`toast toast--${type}`}>
            {message}
        </div>
    );
}

export default Toast;