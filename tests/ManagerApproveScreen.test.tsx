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

    it('displays manager approve screen', () => {
        const text = wrapper.children[0].children[0]
        expect(text === 'Approve Clock Ins and Outs').toBe(true)
    })
});