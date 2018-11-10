import "./ValidatedInput.css";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { ValidationStates } from "../../constants";

class ValidatedInput extends React.Component {
  state = { valid: ValidationStates.ERROR, touched: false };

  onChange = e => {
    const { validate, onChange } = this.props;
    const text = e.target.value;
    const valid = validate(text);
    this.setState({ valid });
    onChange(text, valid);
  };

  onBlur = e => {
    this.setState({ touched: true });
  };

  render = () => {
    const { className, placeholder, value, onBlur, formatValue } = this.props;
    const { valid, touched } = this.state;
    let classStr = className || "";
    if (touched) {
      if (valid === ValidationStates.ERROR) {
        classStr += " error";
      } else if (valid === ValidationStates.OK) {
        classStr += " ok";
      }
    }
    return (
      <input
        className={classStr}
        onChange={this.onChange}
        placeholder={placeholder || ""}
        value={formatValue ? formatValue(value) : value}
        onBlur={this.onBlur}
      />
    );
  };
}

ValidatedInput.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  formatValue: PropTypes.func
};

export default ValidatedInput;
