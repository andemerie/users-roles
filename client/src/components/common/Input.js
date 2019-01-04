import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Input = ({label, value, disabled, onChange, onBlur, icon, errorText}) => (
  <div className="field">
    <label className="label">{label}</label>
    <div className="control has-icons-left">
      <input
        className={cn('input', {'is-danger': errorText})}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
      />
      <span className="icon is-small is-left">
        <i className={`fas fa-${icon}`} />
      </span>
    </div>
    {errorText && <p className="help is-danger">{errorText}</p>}
  </div>
);

Input.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  errorText: PropTypes.string,
};

Input.defaultProps = {
  disabled: false,
  errorText: '',
};

export default Input;
