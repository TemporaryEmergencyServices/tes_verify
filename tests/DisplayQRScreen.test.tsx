import React from "react";
import renderer from 'react-test-renderer';
import { act, fireEvent, render } from '@testing-library/react-native';
import DisplayQRScreen from "../screens/DisplayQRScreen"
import { Provider } from 'react-redux'

import { store } from '../App'

jest.useFakeTimers()

describe("<DisplayQRScreen />", () => {
    const navigation={}
    const tree = renderer.create(<Provider store={store} ><DisplayQRScreen navigation={navigation}/></Provider>)
    const wrapper = tree.toJSON()

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot()
    });

    it('renders unauthorized view', () => {
        const text = wrapper.children[0].children[0]
        expect(text).toBe(' You are not authorized :( ')
    })
});