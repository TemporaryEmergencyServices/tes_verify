import React from "react";
import renderer from "react-test-renderer";
import RecordsScreen from "../screens/RecordsScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<RecordsScreen />", () => {
    it('renders correctly', () => {
        const tree = renderer.create(<Provider store={store} ><RecordsScreen /></Provider>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});