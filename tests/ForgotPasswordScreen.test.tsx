import React from "react";
import renderer from "react-test-renderer";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<ForgotPasswordScreen />", () => {
    it('renders correctly', () => {
        const navigation={}
        const tree = renderer.create(<Provider store={store} ><ForgotPasswordScreen navigation={navigation}/></Provider>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});