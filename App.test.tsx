import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';

jest.useFakeTimers()

describe('<App />', () => {
  it('has 1 child', () => {
    console.log(<App />)
    const tree = renderer.create(<App />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});