import React from "react";
import Root from "@src";
import { loginWithToken } from "@api";
import fetchMock from "jest-fetch-mock";
import { render, fireEvent, toJSON } from "@testing-library/react-native";
import { act } from "react-test-renderer";

jest.mock("@api", () => ({
  loginWithToken: jest.fn(),
}));

const setup = (response = {}) => {
  if (Object.keys(response).length > 0) {
    fetchMock.mockOnce(JSON.stringify(response));
  }
  return render(<Root />);
};

describe("Root container", () => {
  it("should make an api call on login", async () => {
    act(() => {
      const { container } = render(<Root />);
    });
    expect(loginWithToken).toHaveBeenCalled();
  });
});
