'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Switch,
  Keyboard,
  TextInput
} from 'react-native';

import moment from 'moment'


import { connect }         from 'react-redux';
import * as actionCreators from '../redux/actions';

import * as facebookAPI    from '../common/fbAPIs';
import ErrorBar            from '../components/ErrorBar';
import NavBar              from '../components/NavBar';

var toolbarGap    = 40;
var navBarHeight  = 64;
var fixedOffset   = navBarHeight + toolbarGap;
var tabBarHeight  = 48;

const styles = StyleSheet.create({
  toolbar: {
    height: toolbarGap,
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderTopWidth: 0.5,
    borderColor: '#b2b2b2',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    paddingLeft: 10,
  },
  toolbarText: {
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    paddingRight: 10,
    paddingLeft: 10,
  },
  toolbarSwitch: {
    marginBottom: 2,
  },
  input: {
    marginTop: 0,
    padding: 10,
    backgroundColor: '#FFF',
    fontFamily: 'System',
    fontSize: 18
  },
});

class PostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleHeight: Dimensions.get('window').height - fixedOffset - tabBarHeight,
      post: { data: "" },
      publish: false,
    };
  }

  componentWillMount () {
    const { dispatch, login, pages } = this.props

    // this is used to resize the view when the keyboard appears / disappears
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))

    // check if we do have 'publish_pages' in our permissions, or request it
    // then request the Page token (either when we get the permission, or directly if we do have it)
    if (!login.permissions || login.permissions.indexOf('publish_pages') === -1) {
      dispatch(actionCreators.requestPublishPermissions(['manage_pages', 'publish_pages']))
        .then( (result) => {
          dispatch(actionCreators.getPageToken(pages.currentPageId))
            .then( Function.prototype )
            .catch( Function.prototype )
        })
        .catch( Function.prototype )
    } else {
      dispatch(actionCreators.getPageToken(pages.currentPageId))
        .then( Function.prototype )
        .catch( Function.prototype )
    }
  }

  keyboardWillShow (e) {
    let newSize = Dimensions.get('window').height - e.endCoordinates.height - fixedOffset
    this.setState(
      {
        visibleHeight: newSize
      }
    );
  }

  keyboardWillHide (e) {
    this.setState(
      {
        visibleHeight: Dimensions.get('window').height - fixedOffset - tabBarHeight
      }
    );
  }

  schedulePost( ){
    // I need a action type...
    // I need a scheudler....scheduler will run based on the user input....

    let schedulePostAction = (access_token) => {
      dispatch(actionCreators.sendSchedulePost(pages.currentPageId, access_token, {
        message:   this.state.post.data,
        published: false,
        scheduled_publish_time: Date.now().getUnixTime() + 10000;
      })).then( () => {
        this.setState({ post: { data: "" }});
        this.props.gotoDefaultTab();
      }).catch( Function.prototype )
    }

    // if we do not have a token at this stage, we'll try requesting it again
    if (pages.pageToken[pages.currentPageId]) {
      schedulePostAction(pages.pageToken[pages.currentPageId])
    } else {
      dispatch(actionCreators.getPageToken(pages.currentPageId))
      .then( (result) => {
        // here we need to use the new access token to post,
        // as the pages props has not been updated within the `then`
        postAction(result.access_token)
      }).then( Function.prototype )
        .catch( Function.prototype )
    }

  }


  sendPost() {
    const { dispatch, pages } = this.props;

    let postAction = (access_token) => {
      dispatch(actionCreators.sendPost(pages.currentPageId, access_token, {
        message:   this.state.post.data,
        published: this.state.publish,
      })).then( () => {
        this.setState({ post: { data: "" }});
        this.props.gotoDefaultTab();
      }).catch( Function.prototype )
    }

    // if we do not have a token at this stage, we'll try requesting it again
    if (pages.pageToken[pages.currentPageId]) {
      postAction(pages.pageToken[pages.currentPageId])
    } else {
      dispatch(actionCreators.getPageToken(pages.currentPageId))
      .then( (result) => {
        // here we need to use the new access token to post,
        // as the pages props has not been updated within the `then`
        postAction(result.access_token)
      }).then( Function.prototype )
        .catch( Function.prototype )
    }
  }

  renderToolbar() {
    return (
      <View style={ styles.toolbar }>
        <Text style={ styles.toolbarText }>
          Publish
        </Text>
        <Switch
          value={this.state.publish}
          onValueChange={(value) => this.setState({publish: value})}
          style={ styles.toolbarSwitch }/>
      </View>
    )
  }

  render() {
    const { dispatch, pages } = this.props
    let errorView   = null;

    /*if (pages.errorToken) {
      let clearMessage = () => { dispatch(actionCreators.clearTokenErrors()) }
      errorView   = <ErrorBar textMessage="Could not get publish permissions"
                              clearCallback={clearMessage} onPress={clearMessage}/>
    } else if (pages.errorPost) {
      let clearMessage = () => { dispatch(actionCreators.clearPostErrors()) }
      errorView   = <ErrorBar textMessage="Error while sending the post"
                              clearCallback={clearMessage} onPress={clearMessage}/>
    }*/

    return (
      <NavBar
        title="New Post"
        onLeftPress={ this.props.gotoDefaultTab }
        leftButtonText="Cancel"
        onRightPress={ this.sendPost.bind(this) }
        rightButtonText="Post">
          <View style={{height: this.state.visibleHeight}}>
            { errorView }
            <TextInput
              multiline={true}
              onChangeText={(text) => {
                this.state.post.data = text;
              }}
              defaultValue={this.state.post.data}
              autoFocus={true}
              placeholder="Write something…"
              style={[styles.input, {height:this.state.visibleHeight}]} />
            { this.renderToolbar() }
          </View>
      </NavBar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login:    state.login,
    accounts: state.accounts,
    pages:    state.pages,
  }
}

export default connect(mapStateToProps)(PostScreen);
