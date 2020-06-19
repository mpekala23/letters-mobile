import React from "react";
import { ComposePostcardScreen } from "@views";
import { render, fireEvent, toJSON } from "@testing-library/react-native";
import { LetterTypes, LetterStatus } from "types";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

const setup = () => {
  const navigation = { navigate: jest.fn() };

  const store = mockStore({
    letter: {
      adding: {
        type: LetterTypes.Letters,
        status: LetterStatus.Draft,
        isDraft: true,
        recipientId: -1,
        message: "",
        photoPath: "",
        letterId: -1,
      },
    },
  });

  const StoreProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(<ComposePostcardScreen navigation={navigation} />, {
      wrapper: StoreProvider,
    }),
  };
};

describe("ComposePostcard screen", () => {
  it("should match snapshot", () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });
});
