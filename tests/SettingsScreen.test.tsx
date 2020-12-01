import React from "react";
import renderer from "react-test-renderer";
import SettingsScreen from "../screens/SettingsScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<SettingsScreen />", () => {
    const navigation = {}
    const tree = renderer.create(<Provider store={store} ><SettingsScreen navigation={navigation}/></Provider>)
    const wrapper = tree.toJSON()

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('displays screen for admin', () => {
        const text = wrapper.children[0].children[0]
        expect(text === ' Welcome! ').toBeDefined()
    })
});