import React from "react";
import renderer from "react-test-renderer";
import ManagerApproveScreen from "../screens/ManagerApproveScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<ManagerApproveScreen />", () => {
    const tree = renderer.create(<Provider store={store} ><ManagerApproveScreen /></Provider>)
    const wrapper = tree.toJSON()

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('displays not authorized', () => {
        console.log(wrapper.children[0])
        const text = wrapper.children[0].children[0]
        expect(text === 'Volunteer Records for ').toBe(true)
    })
});