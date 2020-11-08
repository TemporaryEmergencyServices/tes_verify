import React from "react";
import renderer from "react-test-renderer";
import NotFoundScreen from "../screens/NotFoundScreen"

jest.useFakeTimers()

describe("<NotFoundScreen />", () => {
    it('renders correctly', () => {
        const navigation = {}
        const tree = renderer.create(<NotFoundScreen navigation={navigation}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});