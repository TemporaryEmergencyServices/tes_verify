import React from "react";
import renderer from "react-test-renderer";
import SignUpScreen from "../screens/SignUpScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<SignUpScreen />", () => {
    const navigation = {}
    const tree = renderer.create(<Provider store={store} ><SignUpScreen navigation={navigation}/></Provider>);
    const wrapper = tree.toJSON()

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });
});