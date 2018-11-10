import React from "react";

import { expect } from "chai";
import { mount } from "enzyme";
import sinon from "sinon";
import ValidatedInput from "./ValidatedInput";
import { ValidationStates } from "../../constants";

const mockInput = (validate = () => {}, onChange = () => {}) =>
  mount(
    <ValidatedInput validate={validate} onChange={onChange} value={"test"} />
  );

it("sets className based on valid/touched", () => {
  const wrapper = mockInput();
  expect(wrapper.find("input").hasClass("error")).to.equal(false);
  expect(wrapper.find("input").hasClass("ok")).to.equal(false);

  wrapper.setState({ touched: true });
  expect(wrapper.find("input").hasClass("error")).to.equal(true);
  expect(wrapper.find("input").hasClass("ok")).to.equal(false);

  wrapper.setState({ valid: ValidationStates.OK });
  expect(wrapper.find("input").hasClass("error")).to.equal(false);
  expect(wrapper.find("input").hasClass("ok")).to.equal(true);
});

it("calls validate and onChange", () => {
  const validateStub = sinon.stub().returns(ValidationStates.OK);
  const onChangeStub = sinon.stub();
  const wrapper = mockInput(validateStub, onChangeStub);
  wrapper.find("input").simulate("change", { target: { value: "test" } });

  expect(validateStub.called).to.equal(true);
  expect(validateStub.lastCall.args[0]).to.equal("test");
  expect(onChangeStub.lastCall.args[0]).to.equal("test");
  expect(onChangeStub.lastCall.args[1]).to.equal(ValidationStates.OK);
});

it("sets touched", () => {
  const wrapper = mockInput();
  expect(wrapper.state("touched")).to.equal(false);
  wrapper.find("input").simulate("blur");
  expect(wrapper.state("touched")).to.equal(true);
});
