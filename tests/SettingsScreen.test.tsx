import React from "react";
import renderer from "react-test-renderer";
import SettingsScreen from "../screens/SettingsScreen"
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<SettingsScreen />", () => {
    it('renders correctly', () => {
        const navigation = {}
        const tree = renderer.create(<Provider store={store} ><SettingsScreen navigation={navigation} /></Provider>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});