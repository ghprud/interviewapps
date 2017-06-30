'use strict'

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  textStyle: {
    margin: 20,
    textAlign: 'center',
    fontFamily: 'System',
    fontSize: 20
  }
});

class Loading extends Component {
  static propTypes: {
    activitySize: PropTypes.string,
    activityColor: PropTypes.string,
  }

  defaultProps: {
    activitySize:  'large',
    activityColor: "#3b5998",
  }

  render() {
    return (
      <View
        style={this.props.viewStyle}
      >
        <Text
          style={this.props.textStyle}
        >
          { this.props.textMessage }
        </Text>
        <ActivityIndicator
          size={this.props.activitySize}
          color={this.props.activityColor}
        />
      </View>
    )
  }
}

export default Loading;
