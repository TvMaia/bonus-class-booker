export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
    return (
      <div className="modal">
        <div className="modal-content">
          <button onClick={onClose}>Fechar</button>
          {children}
        </div>
      </div>
    );
  }