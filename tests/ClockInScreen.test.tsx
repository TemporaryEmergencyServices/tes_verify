import React from "react";
import renderer from "react-test-renderer";
import ClockInScreen from "../screens/ClockInScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<ClockInScreen />", () => {
    it('renders correctly', () => {
        const tree = renderer.create(<Provider store={store} ><ClockInScreen /></Provider>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});