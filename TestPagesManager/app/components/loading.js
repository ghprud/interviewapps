'use strict'

import React from 'react-native'

export default class Loading extends React.Component {
  render() {
    return (
      <React.View style={this.props.viewStyle}>
        <React.Text style={this.props.textStyle}>
          { this.props.textMessage }
        </React.Text>
        <React.ActivityIndicatorIOS size={this.props.activitySize} color={this.props.activityColor} />
      </React.View>
    )
  }
}

Loading.propTypes = {
  activitySize:  React.PropTypes.oneOf(['large', 'small']),
  activityColor: React.PropTypes.string,
}

Loading.defaultProps = {
  viewStyle:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textStyle:     { margin: 20, textAlign: 'center', fontFamily: 'System', fontSize: 20 },
  activitySize:  'large',
  activityColor: "#3b5998",
}
