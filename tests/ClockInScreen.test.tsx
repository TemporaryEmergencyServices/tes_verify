import React from "react";
import renderer from 'react-test-renderer';
import { act, fireEvent, render } from '@testing-library/react-native';
import ClockInScreen from "../screens/ClockInScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<ClockInScreen />", () => {
    const tree = renderer.create(<Provider store={store} ><ClockInScreen /></Provider>)
    const wrapper = tree.toJSON()

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot()
    });

    // it('displays activity indicator', () => {
    //     const text = wrapper.children[0].children[0]
    //     expect(wrapper.children[0].type === 'ActivityIndicator').toBeDefined()
    // })
});