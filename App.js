import React, {Component} from 'react';
import AppContainer from './MainNavigation';
export default class App extends React.Component {
  render() {
    const { started, error, codeInput, sent, auto, user } = this.state;
    return (
      <AppContainer />
    )
  }
}