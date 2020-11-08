import React from "react";
import renderer from "react-test-renderer";
import ManagerApproveScreen from "../screens/ManagerApproveScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<ManagerApproveScreen />", () => {
    it('renders correctly', () => {
        const tree = renderer.create(<Provider store={store} ><ManagerApproveScreen /></Provider>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    // it('renders appropriate status', () => {

    // })
});