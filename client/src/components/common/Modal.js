import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Modal = ({className, title, onClose, children, onSubmit}) => (
  <div className={cn('modal is-active', className)}>
    <div className="modal-background" />
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">{title}</p>
        <button className="delete" aria-label="close" onClick={onClose} />
      </header>
      <section className="modal-card-body">{children}</section>
      <footer className="modal-card-foot">
        <button className="button is-success" onClick={onSubmit}>
          Save changes
        </button>
        <button className="button" onClick={onClose}>
          Cancel
        </button>
      </footer>
    </div>
  </div>
);

Modal.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  className: '',
};

export default Modal;
