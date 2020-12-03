import React from "react";
import renderer from 'react-test-renderer';
import { act, fireEvent, render } from '@testing-library/react-native';
import QueryClockScreen from "../screens/QueryClockScreen"
import { Provider } from 'react-redux'

import { store } from '../App'

jest.useFakeTimers()

describe("<QueryClockScreen />", () => {
    const navigation={}
    const tree = renderer.create(<Provider store={store} ><QueryClockScreen navigation={navigation}/></Provider>)
    const wrapper = tree.toJSON()

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot()
    });

    it('renders unauthorized view', () => {
        const text = wrapper.children[0].children[0]
        expect(text).toBe('Search for records by name, userid, gender, ethnicity, and/or date.')
    })
});