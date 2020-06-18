import * as React from "react";
import { SingleContactScreen } from "@views";
import { render, toJSON, fireEvent } from "@testing-library/react-native";
import { LetterTypes, LetterStatus } from "../../src/types";

const setup = (letterOverrides = []) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const contact = Object.assign({
    state: "Minnesota",
    firstName: "First",
    lastName: "Last",
    inmateNumber: "6",
    relationship: "Brother",
  });
  const letters = Object.assign(
    [
      {
        type: LetterTypes.PostCards,
        status: LetterStatus.Printed,
        isDraft: true,
        recipientId: 8,
        message: "I'm trying out this new service called Ameelio...",
        photoPath: "",
      },
      {
        type: LetterTypes.PostCards,
        status: LetterStatus.OutForDelivery,
        isDraft: false,
        recipientId: 8,
        message: "Hi Emily! How are you doing? I'm trying out this...",
        photoPath: "",
      },
      {
        type: LetterTypes.PostCards,
        status: LetterStatus.Mailed,
        isDraft: false,
        recipientId: 8,
        message: "I'm trying out this new service called Ameelio...",
        photoPath: "",
      },
    ],
    letterOverrides
  );

  const route = {
    params: Object.assign({
      contact: contact,
      letters: letters,
    }),
  };

  return {
    navigation,
    ...render(
      <SingleContactScreen navigation={navigation} route={route} />,
      {}
    ),
  };
};

describe("Single Contact Screen", () => {
  it("should match snapshot", () => {
    const { container } = setup(<SingleContactScreen />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it("should load values for letters from the redux store", () => {
    const { getByText } = setup([
      {
        type: LetterTypes.PostCards,
        status: LetterStatus.OutForDelivery,
        isDraft: false,
        recipientId: 8,
        message: "Redux Letter 1",
        photoPath: "",
      },
      {
        type: LetterTypes.PostCards,
        status: LetterStatus.OutForDelivery,
        isDraft: false,
        recipientId: 8,
        message: "Redux Letter 2",
        photoPath: "",
      },
    ]);
    expect(getByText("Redux Letter 1").props.children).toBe("Redux Letter 1");
    expect(getByText("Redux Letter 2").props.children).toBe("Redux Letter 2");
  });
});
