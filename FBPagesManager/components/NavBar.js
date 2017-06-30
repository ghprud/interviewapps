'use strict'

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

const styles = StyleSheet.create({
  navBarTitleStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sceneContainerStyle: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 30
  },
  navBarContainerStyle: {
    paddingTop: 30,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderColor: '#b2b2b2',
    height: 64,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  navBarTitleTextStyle: {
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: 18
  },
  buttonContainerStyle: {
    flex: 1,
    overflow:'hidden',
    justifyContent:'center'
  },
  leftButtonStyle: {
    alignItems: 'flex-start'
  },
  rightButtonStyle: {
    alignItems: 'flex-end'
  },
  buttonTextStyle: {
    marginLeft: 10,
    marginRight: 10,
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: 16,
    color: '#5A7EB0'
  },
});


export default class NavBar extends Component {
  static propTypes: {
    leftButtonText: React.PropTypes.string,
    rightButtonText: React.PropTypes.string,
    leftButtonView:  React.PropTypes.object,
    rightButtonView: React.PropTypes.object,
    onLeftPress:  React.PropTypes.func,
    onRightPress: React.PropTypes.func,
  }

  defaultProps: {
    leftButtonText:       "Cancel",
    leftButtonView:       undefined,
    rightButtonText:      "",
    rightButtonView:      undefined,
    onLeftPress:          null,
    onRightPress:         null,
  }

  render() {
    // left button default is text..can be passed in as a prop to the component too..
    let leftButton  = this.props.leftButtonView ||
      <Text
        style={styles.buttonTextStyle}
      >
        {this.props.leftButtonText}
      </Text>;

    let rightButton = this.props.rightButtonView ||
      <Text
        style={styles.buttonTextStyle}
      >
          {this.props.rightButtonText}
      </Text>;

    return (
      <View style={ styles.sceneContainerStyle }>
        <View style={ styles.navBarContainerStyle }>
          <TouchableOpacity
            onPress={ this.props.onLeftPress }
            style={ [ styles.buttonContainerStyle, styles.leftButtonStyle ] }>
            { leftButton }
          </TouchableOpacity>
          <View style={styles.navBarTitleStyle}>
            <Text style={this.props.navBarTitleTextStyle}>
              { this.props.title }
            </Text>
          </View>
          <TouchableOpacity
            onPress={ this.props.onRightPress }
            style={ [ styles.buttonContainerStyle, styles.rightButtonStyle ] }>
            { rightButton }
          </TouchableOpacity>
        </View>
        { this.props.children }
      </View>
    )
  }
}
