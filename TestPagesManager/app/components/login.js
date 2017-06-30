// Facebook Login component

'use strict'

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  LoginButton,
  AccessToken
} from 'react-native-fbsdk';

// -- Redux store related
//import { connect }         from 'react-redux'
import * as actionCreators from '../actions'

// Allows to request only readPermissions
// see https://github.com/facebook/react-native-fbsdk/issues/52
// "readPermissions and publishPermissions cannnot be requested at the same time
// on the login button (because you need to separate the requests for read and
// write permissions)"
// set only the readPermissions, and then use the LoginManager to request the
// publish permissions at a later time (when the user does some action that actually
// requires a publish).
class Login extends Component {
  render() {
    const { dispatch } = this.props
    return (
      <View style={this.props.style}>
        <LoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              dispatch(actionCreators.loginFailure());
            } else {
              if (result.isCancelled) {
                dispatch(actionCreators.loginFailure());
              } else {
                console.log("login", result)
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

Login.propTypes = {
  dispatch:        React.PropTypes.func,
  readPermissions: React.PropTypes.array,
}

Login.defaultProps = {
  readPermissions: [],
}

const mapStateToProps = (state) => { return { login: state.login } }

//export default connect(mapStateToProps)(Login);
export default Login;


const styles = StyleSheet.create({
  loginButton: { width: 200, height: 50, },
});
