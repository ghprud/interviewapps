'use strict'

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

export default class ErrorBar extends React.Component {
  static propTypes: {
    clearCallback: PropTypes.func,
    onPress:       PropTypes.func,
    green:         PropTypes.bool,
  }

  defaultProps: {
    clearCallback: Function.prototype,
    onPress:       Function.prototype,
    green:         false,
    viewStyle:     { height: 24, alignItems: 'center', justifyContent: 'center' },
    textStyle:     { margin: 2, textAlign: 'center', fontFamily: 'System', fontSize: 14, color: 'white' },
  }

  render() {
    let backgroundColor = '#f88080' // Pink
    if (this.props.green) {
      backgroundColor = '#108010'   // Green
    }

    setTimeout(() => { this.props.clearCallback() }, 20000);

    return (
      <TouchableHighlight style={ [this.props.viewStyle, { backgroundColor: backgroundColor }]}
        onPress={ () => { typeof this.props.onPress === 'function'? this.props.onPress() : null} }>
        <Text style={this.props.textStyle}>
          { this.props.textMessage }
        </Text>
      </TouchableHighlight>
    );
  }
}
