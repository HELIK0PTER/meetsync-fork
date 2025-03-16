// components/Button.js
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ children, onClick, type, disabled, className, rounded, big }) => {
    return (
        <button
            onClick={onClick}
    type={type}
    disabled={disabled}
    className={`${styles.button} ${className} ${rounded && styles.rounded} ${big && styles.bigbutton}`}
>
    {children}
    </button>
);
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    disabled: PropTypes.bool,
    className: PropTypes.string,
    rounded: PropTypes.bool,
    big: PropTypes.bool,
};

Button.defaultProps = {
    onClick: () => {},
    type: 'button',
    disabled: false,
    className: '',
};

export default Button;