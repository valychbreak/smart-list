/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import td from "testdouble";
import tdJest from "testdouble-jest";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

tdJest(td, jest);
configure({ adapter: new Adapter() });
