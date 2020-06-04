import React from 'react';
import { Button } from "@components";
import { ReferFriendsScreen } from "@views";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const setupShallow = () => {
	const navigation = { navigate: jest.fn() };
	const wrapper = shallow(<ReferFriendsScreen navigation={navigation} />);
	return {
		wrapper,
	};
};

const setupBlankInstance = () => {
	const navigation = { navigate: jest.fn() };
	const element = renderer.create(<ReferFriendsScreen navigation={navigation} />);
	const instance = element.getInstance();
	return {
		element,
		instance,
	};
};

describe("ReferFriends screen", () => {
	test("renders", () => {
		const { wrapper } = setupShallow();
		expect(wrapper).toMatchSnapshot();
	});
	// TO-DO: Update test when actual skip press action is hooked in
	test("on skip press", async () => {
		const { element } = setupBlankInstance();
		const referFriendsScreen = element.root;
		const shareButton = referFriendsScreen.findAllByType(Button)[0];
		await shareButton.props.onPress();
		expect(referFriendsScreen._fiber.stateNode.state.pressedSkip).toBe(true);
	});
	test("sharable link on share press", async () => {
		const { element } = setupBlankInstance();
		const referFriendsScreen = element.root;
		const shareButton = referFriendsScreen.findAllByType(Button)[1];
		await shareButton.props.onPress();
		expect(referFriendsScreen._fiber.stateNode.state.shareableLink).toBe(true);
	});
});
