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
        // const wrapper = tree.toJSON()
        // let root = tree.root
        const text = wrapper.children[0].children[0]
        expect(text === ' You are not authorized :( ').toBe(true)
        // TODO: add capability for authorized
    })
});