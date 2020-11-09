import React from "react";
import renderer from "react-test-renderer";
import SignInScreen from "../screens/SignInScreen"
import { act, fireEvent, render } from '@testing-library/react-native'
import { Provider } from 'react-redux'
import { store } from '../App'

jest.useFakeTimers()

describe("<SignInScreen />", () => {
    const navigation = {}
    const tree = renderer.create(<Provider store={store} ><SignInScreen navigation={navigation}/></Provider>);
    const wrapper = tree.toJSON()

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });

    // it('sets email', () => {
    //     const { getByText, getByPlaceholderText } = render(<Provider store={store} ><SignInScreen navigation={navigation}/></Provider>)
    //     const email = 'brandon@lucas.com'
    //     const emailForm = getByPlaceholderText('Email...')
    //     fireEvent.changeText(emailForm, email)
    //     console.log(wrapper.children[1].children[0])
    //     console.log(emailForm)
    //     // expect(getByText(email)).toBe()
    // })

    // it('sets password', () => {
    //     const { getByText, getByPlaceholderText } = render(<Provider store={store} ><SignInScreen navigation={navigation}/></Provider>)
    //     const password = 'wordpass'
    //     const passwordForm = getByPlaceholderText('Password...')
    //     fireEvent.changeText(passwordForm, password)
    //     expect(getByText(password)).toBeDefined()
    // })
});