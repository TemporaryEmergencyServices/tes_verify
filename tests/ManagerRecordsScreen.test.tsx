import React from "react";
import renderer from 'react-test-renderer';
import { act, fireEvent, render } from '@testing-library/react-native';
import ManagerRecordsScreen from "../screens/ManagerRecordsScreen"
import { Provider } from 'react-redux'

import { store } from '../App'

jest.useFakeTimers()

describe("<ManagerRecordsScreen />", () => {
    const navigation={}
    const tree = renderer.create(<Provider store={store} ><ManagerRecordsScreen navigation={navigation}/></Provider>)
    const wrapper = tree.toJSON()

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot()
    });

    it('shows volunteer records', () => {
        const text = wrapper.children[0].children[0]
        expect(text).toBe(' Volunteer Records ')
    })
});