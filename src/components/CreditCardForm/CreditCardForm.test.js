import React from "react";

import { expect } from "chai";
import { mount } from "enzyme";
import sinon from "sinon";
import CreditCardForm from "./CreditCardForm";
import { ValidationStates } from "../../constants";

const mockForm = () => mount(<CreditCardForm />);

describe("CreditCardForm", () => {
  let form, instance;
  beforeEach(() => {
    form = mockForm();
    refreshInstance();
  });

  const refreshInstance = () => {
    instance = form.instance();
  };

  it("validates names", () => {
    expect(instance.validateName("")).to.equal(ValidationStates.ERROR);
    expect(instance.validateName("Test")).to.equal(ValidationStates.OK);
  });

  it("validates amex", () => {
    expect(instance.validateAmex("444")).to.equal(ValidationStates.ERROR);
    expect(instance.validateAmex("3737 373737 373")).to.equal(
      ValidationStates.ERROR
    );
    expect(instance.validateAmex("3737 37737 3373")).to.equal(
      ValidationStates.ERROR
    );
    expect(instance.validateAmex("3737 373737 37373")).to.equal(
      ValidationStates.OK
    );
  });

  it("validates visa", () => {
    expect(instance.validateVisa("4444 444 4444 4444")).to.equal(
      ValidationStates.ERROR
    );
    expect(instance.validateVisa("44444 444 4444 444")).to.equal(
      ValidationStates.ERROR
    );
    expect(instance.validateVisa("4444 4444 4444 4444")).to.equal(
      ValidationStates.OK
    );
  });

  it("validates cvv", () => {
    expect(instance.validateCvv("")).to.equal(ValidationStates.ERROR);
    form.setState({ cardType: "VISA" });
    refreshInstance();
    expect(instance.validateCvv("4444")).to.equal(ValidationStates.ERROR);
    expect(instance.validateCvv("444")).to.equal(ValidationStates.OK);
    form.setState({ cardType: "AMEX" });
    refreshInstance();
    expect(instance.validateCvv("444")).to.equal(ValidationStates.ERROR);
    expect(instance.validateCvv("4444")).to.equal(ValidationStates.OK);
  });
});
