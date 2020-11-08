import React from "react";
import renderer from "react-test-renderer";
import ClockInScreen from "../screens/ClockInScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<ClockInScreen />", () => {
    const wrapper = renderer.create(<Provider store={store} ><ClockInScreen /></Provider>).toJSON()

    it('renders correctly', () => {
        // const tree = renderer.create(<Provider store={store} ><ClockInScreen /></Provider>).toJSON()
        expect(wrapper).toMatchSnapshot()
    });

    it('defaults to user not having access', () => {
        console.log(wrapper.children[0].children[0])
        const noAccessText = wrapper.children[0].children[0]
        expect(noAccessText === ' You are not authorized :( ').toBe(true)
    })

    // it('clicks clock in' () =)
});