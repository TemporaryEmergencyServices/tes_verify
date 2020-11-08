import React from "react";
import renderer from "react-test-renderer";
import SignInScreen from "../screens/SignInScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<SignInScreen />", () => {
    it('renders correctly', () => {
        const navigation = {}
        const tree = renderer.create(<Provider store={store} ><SignInScreen navigation={navigation}/></Provider>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    // it('signs in', () => {

    // })
});