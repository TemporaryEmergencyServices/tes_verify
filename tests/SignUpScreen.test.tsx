import React from "react";
import renderer from "react-test-renderer";
import SignUpScreen from "../screens/SignUpScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<SignUpScreen />", () => {
    it('renders correctly', () => {
        const navigation = {}
        const tree = renderer.create(<Provider store={store} ><SignUpScreen navigation={navigation}/></Provider>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});