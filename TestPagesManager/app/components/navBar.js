'use strict'

import React from 'react-native'

export default class NavBar extends React.Component {
  render() {
    let leftButton  = this.props.leftButtonView ||
      <React.Text style={this.props.buttonTextStyle}>{this.props.leftButtonText}</React.Text>;

    let rightButton = this.props.rightButtonView ||
      <React.Text style={this.props.buttonTextStyle}>{this.props.rightButtonText}</React.Text>;

    return (
      <React.View style={ this.props.sceneContainerStyle }>
        <React.View style={ this.props.navBarContainerStyle }>
          <React.TouchableOpacity
            onPress={ this.props.onLeftPress }
            style={ [ this.props.buttonContainerStyle, this.props.leftButtonStyle ] }>
            { leftButton }
          </React.TouchableOpacity>
          <React.View style={this.props.navBarTitleStyle}>
            <React.Text style={this.props.navBarTitleTextStyle}>
              { this.props.title }
            </React.Text>
          </React.View>
          <React.TouchableOpacity
            onPress={ this.props.onRightPress }
            style={ [ this.props.buttonContainerStyle, this.props.rightButtonStyle ] }>
            { rightButton }
          </React.TouchableOpacity>
        </React.View>
        { this.props.children }
      </React.View>
    )
  }
}

NavBar.propTypes = {
}

NavBar.defaultProps = {
  sceneContainerStyle:  { flex: 1, paddingTop: 64, paddingBottom: 30 },
  navBarContainerStyle: { paddingTop: 30, paddingBottom: 8, borderBottomWidth: 0.5,
    borderColor: '#b2b2b2', height: 64, backgroundColor: '#f8f8f8', flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'stretch', position: 'absolute', top: 0, left: 0, right: 0 },
  navBarTitleStyle:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navBarTitleTextStyle: { fontFamily: 'System', fontWeight: '500', fontSize: 18 },
  buttonContainerStyle: { flex: 1, overflow:'hidden', justifyContent:'center' },
  leftButtonStyle:      { alignItems: 'flex-start' },
  rightButtonStyle:     { alignItems: 'flex-end' },
  buttonTextStyle:      { marginLeft: 10, marginRight: 10, fontFamily: 'System',
    fontWeight: '500', fontSize:   16, color: '#5A7EB0' },
  leftButtonText:       "Cancel",
  leftButtonView:       undefined,
  rightButtonText:      "",
  rightButtonView:      undefined,
  onLeftPress:          null,
  onRightPress:         null,
}

