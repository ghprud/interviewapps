// originally from https://github.com/TylerLH/react-native-timeago
// but simplified as discussed on https://github.com/reactjs/react-timer-mixin/issues/4
// and using calendar() for the display method

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Moment from 'moment'

export default class TimeAgo extends Component {
  static propTypes: {
    interval: PropTypes.number,
  }

  defaultProps: {
    interval: 60000, // every minute by default
  }

  componentDidMount() {
    this.timer = setTimeout(() => { this.forceUpdate() }, this.props.interval)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    return (
      <Text {...this.props}>
        { Moment(this.props.time).calendar(null, { sameElse: 'llll' }) }
      </Text>
    )
  }
}
