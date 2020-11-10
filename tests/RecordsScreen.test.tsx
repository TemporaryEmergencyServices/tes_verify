import React from "react";
import renderer from "react-test-renderer";
import RecordsScreen from "../screens/RecordsScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<RecordsScreen />", () => {
    const tree = renderer.create(<Provider store={store} ><RecordsScreen /></Provider>)
    const wrapper = tree.toJSON()

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('shows manager approvals', () => {
        const text = wrapper.children[0].children[0]
        expect(text === 'Volunteer Records for ')
    })
});