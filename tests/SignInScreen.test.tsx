import React from "react";
import renderer from "react-test-renderer";
import SignInScreen from "../screens/SignInScreen"
import { act, fireEvent, render } from '@testing-library/react-native'
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<SignInScreen />", () => {
    const navigation = {}
    const tree = renderer.create(<Provider store={store} ><SignInScreen navigation={navigation}/></Provider>);
    const wrapper = tree.toJSON()

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });
});