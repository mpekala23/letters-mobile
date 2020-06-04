import React from 'react';
import { render, fireEvent, toJSON } from "@testing-library/react-native";
import { ReferFriendsScreen } from "@views";
import { facebookShare } from "@api";

jest.mock("@api", () => ({
  facebookShare: jest.fn(),
}));

const setup = (response = {}) => {
  const navigation = { navigate: jest.fn() };
  return render(<ReferFriendsScreen navigation={navigation} />);
};

describe("ReferFriends screen", () => {
	 it("should match snapshot", () => {
	 	const { container } = setup();
	 	const tree = toJSON(container);
	 	expect(tree).toMatchSnapshot();
	 })
	// // TO-DO: Update test when actual skip press action is hooked in
	it("on skip press", async() => {
		const { getByText } = setup();
		const skipButton = getByText("Skip");
		fireEvent.press(skipButton);
	})
	it("should make api call on share press", async() => {
		const { getByText } = setup();
		const shareButton = getByText("Share");
		fireEvent.press(shareButton);
		expect(facebookShare).toHaveBeenCalledTimes(1);
	})
});
