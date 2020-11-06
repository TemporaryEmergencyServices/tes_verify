import React from "react";
import renderer from "react-test-renderer";
import ManagerApproveScreen from "./screens/ManagerApproveScreen"

jest.useFakeTimers()

describe("<ManagerApproveScreen />", () => {
    it('has 1 child', () => {
        console.log(<ManagerApproveScreen />)
        const tree = renderer.create(<ManagerApproveScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});