import "./App.css";

import React, { Component } from "react";

import CreditCardForm from "./components/CreditCardForm/CreditCardForm";

class App extends Component {
  render() {
    return (
      <div className="main">
        <CreditCardForm />
      </div>
    );
  }
}

export default App;
