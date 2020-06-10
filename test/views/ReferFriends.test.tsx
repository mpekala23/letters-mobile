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

	it("should open the home screen when skip is pressed", async() => {
		const { container, getByText } = setup();
		const navigation = container.props.children.props.navigation;
		const skipButton = getByText("Skip");
		fireEvent.press(skipButton);
		expect(navigation.navigate).toHaveBeenCalledWith("Home");
	})
	
	it("should make api call on share press", async() => {
		const { container, getByText } = setup();
		const shareUrl = "https://www.facebook.com/sharer/sharer.php?u=letters.ameelio.org&quote=Insert share message";
		const shareButton = getByText("Share");
		fireEvent.press(shareButton);
		expect(facebookShare).toHaveBeenCalledWith(shareUrl);
	})
});
