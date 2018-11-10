import "./CreditCardForm.css";

import React, { Component } from "react";
import ValidatedInput from "../ValidatedInput/ValidatedInput";
import { ValidationStates } from "../../constants";
import amex from "../../assets/amex.svg";
import visa from "../../assets/visa.svg";

export const CardTypes = {
  VISA: "VISA",
  AMEX: "AMEX"
};

const isNumber = str => str.match(/\d+/g);

class CreditCardForm extends React.Component {
  state = {
    name: "",
    cardNum: "",
    cvv: "",
    month: "",
    year: "",
    cardType: "",
    fields: {},
    submitDisabled: true
  };

  validateName = value =>
    value.length ? ValidationStates.OK : ValidationStates.ERROR;

  validateAmex = value => {
    const arr = value.split(" ");
    if (arr.length !== 3) {
      return ValidationStates.ERROR;
    }
    if (arr[0].length !== 4 || !isNumber(arr[0])) {
      return ValidationStates.ERROR;
    }
    if (arr[1].length !== 6 || !isNumber(arr[0])) {
      return ValidationStates.ERROR;
    }
    if (arr[2].length !== 5 || !isNumber(arr[0])) {
      return ValidationStates.ERROR;
    }
    return ValidationStates.OK;
  };

  validateVisa = value => {
    const arr = value.split(" ");
    if (arr.length !== 4) {
      return ValidationStates.ERROR;
    }
    for (const chunk of arr) {
      if (!isNumber(chunk) || chunk.length !== 4) {
        return ValidationStates.ERROR;
      }
    }
    return ValidationStates.OK;
  };

  validateCardNum = value => {
    if (value.length && parseInt(value[0], 10) === 4) {
      this.setState({ cardType: CardTypes.VISA });
      return this.validateVisa(value);
    } else if (value.length) {
      const substr = value.substring(0, 2);
      if (substr === "37" || substr === "34") {
        this.setState({ cardType: CardTypes.AMEX });
        return this.validateAmex(value);
      }
    }
    this.setState({ cardType: "" });
    return ValidationStates.ERROR;
  };

  validateCvv = value => {
    const { cardType } = this.state;
    if (isNumber(value)) {
      if (
        (cardType === CardTypes.VISA && value.length === 3) ||
        (cardType === CardTypes.AMEX && value.length === 4)
      ) {
        return ValidationStates.OK;
      }
    }
    return ValidationStates.ERROR;
  };

  validateMonth = value => {
    if (isNumber(value)) {
      const month = parseInt(value, 10);
      if (month > 12 || month < 1) {
        return ValidationStates.ERROR;
      }
      const { year } = this.state;
      if (year && isNumber(year)) {
        const now = Date.now();
        const then = new Date(parseInt(year, 10), month - 1);
        if (now < then) {
          return ValidationStates.OK;
        }
      } else {
        return ValidationStates.IN_PROGRESS;
      }
    }
    return ValidationStates.ERROR;
  };

  validateYear = value => {
    if (isNumber(value)) {
      const year = parseInt(value, 10);
      const { month } = this.state;
      if (month && isNumber(month)) {
        const now = Date.now();
        const then = new Date(year, parseInt(month, 10) - 1);
        if (now < then) {
          return ValidationStates.OK;
        }
      } else {
        return ValidationStates.IN_PROGRESS;
      }
    }
    return ValidationStates.ERROR;
  };

  formatAsVisa = value => {
    let output = "";
    for (let i = 0; i < value.length; i++) {
      if (i === 4 || i === 8 || i === 12) {
        output += " ";
      }
      output += value[i];
    }
    return output;
  };

  formatAsAmex = value => {
    let output = "";
    for (let i = 0; i < value.length; i++) {
      if (i === 4 || i === 10) {
        output += " ";
      }
      output += value[i];
    }
    return output;
  };

  formatCCNum = value => {
    value = value.replace(/\s+/g, "");
    if (value.length) {
      if (parseInt(value[0], 10) === 4) {
        return this.formatAsVisa(value);
      } else {
        const substr = value.substring(0, 2);
        if (substr === "37" || substr === "34") {
          return this.formatAsAmex(value);
        }
      }
    }
    return value;
  };

  computeSubmitDisabled = () => {
    const validity = Object.values(this.state.fields);
    for (const valid of validity) {
      if (!valid) {
        this.setState({ submitDisabled: true });
        return;
      }
    }
    this.setState({ submitDisabled: validity.length !== 5 });
  };

  render = () => {
    const {
      name,
      cardNum,
      cvv,
      month,
      year,
      fields,
      cardType,
      submitDisabled
    } = this.state;
    return (
      <div className="container">
        <h2>Enter your credit card information</h2>
        <ValidatedInput
          validate={this.validateName}
          className="row field"
          placeholder="Name"
          value={name}
          onChange={(name, valid) =>
            this.setState(
              { name, fields: { ...fields, name: valid } },
              this.computeSubmitDisabled
            )
          }
        />
        <ValidatedInput
          className="row field"
          placeholder="Card Number"
          value={cardNum}
          validate={this.validateCardNum}
          onChange={(cardNum, valid) =>
            this.setState(
              {
                cardNum,
                fields: { ...fields, cardNum: valid }
              },
              this.computeSubmitDisabled
            )
          }
          formatValue={this.formatCCNum}
        />
        <ValidatedInput
          className="row field"
          placeholder="CVV2"
          value={cvv}
          validate={this.validateCvv}
          onChange={(cvv, valid) =>
            this.setState(
              { cvv, fields: { ...fields, cvv: valid } },
              this.computeSubmitDisabled
            )
          }
        />
        <div className="inline row">
          <ValidatedInput
            className="field"
            placeholder="Exp. Month"
            value={month}
            validate={this.validateMonth}
            onChange={(month, valid) =>
              this.setState(
                { month, fields: { ...fields, month: valid } },
                this.computeSubmitDisabled
              )
            }
          />
          <ValidatedInput
            className="field"
            placeholder="Exp. Year"
            value={year}
            validate={this.validateYear}
            onChange={(year, valid) =>
              this.setState(
                { year, fields: { ...fields, year: valid } },
                this.computeSubmitDisabled
              )
            }
          />
        </div>
        <span className="row">
          <span className="crop">
            <img
              disabled={cardType === CardTypes.VISA}
              src={amex}
              className="logo"
              alt="Amex logo"
            />
          </span>
          <span className="crop">
            <img
              disabled={cardType === CardTypes.AMEX}
              src={visa}
              className="logo"
              alt="Visa logo"
            />
          </span>
        </span>
        <button disabled={submitDisabled} className="row field submitButton">
          Submit
        </button>
      </div>
    );
  };
}

export default CreditCardForm;
