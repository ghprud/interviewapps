'use strict'

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableHighlight
} from 'react-native';

/*import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';*/

import Login from '../components/Login';

const styles = StyleSheet.create({
  firstView: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  welcome: {
    fontSize: 36,
    color: "#5A7EB0",
    fontWeight: "200",
    textAlign: 'center',
    marginTop: 120,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 15,
    color: "#989898",
    fontWeight: "400",
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 20,
    marginRight: 20,
  }
});

export default class WelcomeScreen extends Component {

  /*_onPressButton(infoRequest){
    // get the data...
    console.log("I am here?");
    console.log(infoRequest);
    new GraphRequestManager().addRequest(infoRequest).start();
  }*/

  /*_responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      console.log('Success fetching data (response): ', result);
    }
  }*/

  render() {

    /*const infoRequest = new GraphRequest(
      '/me/accounts',
      null,
      this._responseInfoCallback,
    );*/
    return (
      <View style={styles.firstView}>
        <Text style={styles.welcome}>
          Welcome to{'\n'}
          Pages Manager
        </Text>
        <Login
          readPermissions={ [ 'read_insights', 'pages_show_list' ] }
        />
        <Text style={styles.instructions}>
          Connect to post updates to your Facebook Pages and
          see the number of people that have viewed your posts.
        </Text>
      </View>
    );
  }
}
