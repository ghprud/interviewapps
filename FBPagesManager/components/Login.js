// Facebook Login component
'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import * as actionCreators from '../redux/actions';

import {
  LoginButton,
} from 'react-native-fbsdk';

const styles = StyleSheet.create({
    container: {
      alignItems: 'center'
    },
    loginButton: {
      width: 200,
      height: 50
    }
});

class Login extends Component{
  static propTypes: {
    readPermissions: React.PropTypes.array,
  }

  defaultProps: {
    readPermissions: [],
  }

  render() {
  const { dispatch } = this.props
    return (
      <View style={styles.container}>
        <LoginButton
          onLoginFinished={
            (error, result) => {
            if (error) {
              dispatch(actionCreators.loginFailure());
            } else {
              if (result.isCancelled) {
                dispatch(actionCreators.loginFailure());
              } else {
                dispatch(actionCreators.loginSuccess(result));
              }
            }
          }}
          onLogoutFinished={() => {
            dispatch(actionCreators.logoutSuccess());
          }}
          readPermissions={ this.props.readPermissions }/>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login
  }
}

export default connect(mapStateToProps)(Login);
