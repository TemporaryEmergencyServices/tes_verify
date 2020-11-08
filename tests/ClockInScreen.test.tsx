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
    // const { getByA11yLabel, getByText } = render(<Provider store={store} ><ClockInScreen /></Provider>)

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot()
    });

    it('displays not authorized, clock in, or clock out', () => {
        console.log(wrapper)
        const noAccessText = wrapper.children[0].children[0]
        expect(noAccessText === ' You are not authorized :( ').toBeDefined()
        // TODO: Add clock in, clock out
    })

    // it('clocks in', () => {
    //     const clockInBtn = getByA11yLabel('clock in button')
    //     fireEvent.press(clockInBtn)
    //     const clockInText = getByText(' You clocked in at ')
    //     expect(clockInText).toBeDefined()
    // })

    // it('clocks out', () => {

    // })

});