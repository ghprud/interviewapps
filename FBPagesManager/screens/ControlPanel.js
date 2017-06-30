'use strict'

import _ from 'lodash';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ListView,
  TouchableOpacity
} from 'react-native';

import Icon  from 'react-native-vector-icons/Ionicons';

import { connect }         from 'react-redux';
import * as actionCreators from '../redux/actions';

import * as facebookAPI    from '../common/fbAPIs';
import Login               from '../components/Login';

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 25,
  },
  pageImageSize: {
    width: 20,
    height: 20,
  },
  rowView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#cccccc',
  },
  activeRowView: {
    backgroundColor: '#dddddd',
  },
  rowText: {
    fontWeight: '400',
    fontSize: 16,
    fontFamily: 'System',
    paddingLeft: 5,
    paddingRight: 5,
  },
  headerView: {
    backgroundColor: '#eeeeee',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    padding: 8,
    fontWeight: '500',
    fontSize: 11,
    fontFamily: 'System',
    color: '#888888',
  },
  iconView: {
    width: 30,
    height: 30,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  separator: {
    height: 10,
    backgroundColor: 'red',
  },
  buttonContainer: {
    margin: 10,
  },
  controlPanelWelcome: {
    fontSize: 20,
    paddingBottom: 20,
    fontWeight:'bold',
  },
});

// I am building a list view and connecting the redux state with the props...
// right actions have to be disptached to update the state...

// help and settings menu for the control panel...
function controlMenu(state) {
  const requestNewContent = (dispatch, pageId, toShow) => {
    dispatch(actionCreators.pageContentWithInsights(pageId, toShow))
      .then(  Function.prototype )
      .catch( Function.prototype )
  }

  let showPublished = (state.pages.shown === facebookAPI.FEED_PUBLISHED)
  console.log("show published status", state.pages.shown);
  console.log("show published status", showPublished);

  // just get an array of objects...
  return {
    'Help & Settings': [ {
      name:   "Show unpublished",
      action: (dispatch) => {
        if (!state.login.permissions || state.login.permissions.indexOf('manage_pages') === -1) {
          // make sure we have the correct permissions to show the 'unpublished' posts
          dispatch(actionCreators.requestPublishPermissions(['manage_pages']))
            .then( () => {
              // request new content updates the global state which can be used accordingly...
              requestNewContent(dispatch, state.pages.currentPageId,
                                showPublished? facebookAPI.FEED_ALL : facebookAPI.FEED_PUBLISHED)
            })
            .catch( Function.prototype )
        } else {
          // we have the permissions, request the content
          requestNewContent(dispatch, state.pages.currentPageId,
                            showPublished? facebookAPI.FEED_ALL : facebookAPI.FEED_PUBLISHED)
        }
      },
      icon:   () => {
        return <Icon
          name={
            state.pages.shown === facebookAPI.FEED_PUBLISHED
              ? "ios-checkmark-circle-outline" : "ios-checkmark"
            }
           size={18}
           color="#888888"
         />
      },
    }, {
      name:   "Logout",
      action: (dispatch) => { dispatch(actionCreators.logout()) },
      icon:   <Icon
        name="ios-power"
        size={18}
        color="#888888"  // move all the colors to a common file and name them, to avoid the confusion..
      />
    }]
  }
}

// and the additional sections names
const PAGES_SECTION = 'Pages'

class ControlPanel extends Component {

  static propTypes = {
    dispatch:   React.PropTypes.func.isRequired,
    dataSource: React.PropTypes.object.isRequired,
  }

  // standard method for the list view...
  renderSectionHeader(sectionData, sectionID) {
    return (
      <View
        style={ styles.headerView }
      >
        <Text
          style={ styles.headerText }
        >
          { String(sectionID).toUpperCase() }
        </Text>
      </View>
    )
  }

  // standard method needed for listview...
  renderRow(item) {
    // if the row belongs to the 'Pages' category, then
    // enrich the item with an action to dispatch, and an icon
    let styleRowView = [ styles.rowView ];
    if (item.section === PAGES_SECTION) {
      item.action = () => {
        this.props.dispatch(actionCreators.pageSetCurrent(item.id));
        this.props.closeDrawer();
      }
      item.icon = <Image
          source={{uri: item.picture.data.url}}
          style={ styles.pageImageSize }>
        </Image>
      if (item.id === this.props.pages.currentPageId) {
        styleRowView.push( styles.activeRowView );
      }
    }
    return (
      <TouchableOpacity onPress={ (typeof item.action === 'function')?
                                item.action.bind(undefined, this.props.dispatch) :
                                null }
                        style={ styleRowView }>
        <View style={ styles.iconView }>
          { typeof item.icon === 'function'? item.icon() : item.icon }
        </View>
        <Text style={ styles.rowText }>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.props.dataSource}
        renderRow={this.renderRow.bind(this)}
        renderSectionHeader={this.renderSectionHeader.bind(this)}
      />
    );
  }
}

// Append the section to each menu item
// in order to identify the section when the item is passed to renderRow
function buildMenu(menuDescription) {
  let menu = {};
  for (let [section, entries] of Object.entries(menuDescription)) {
    menu[section] = entries;      // copy the old entries
    for (let entry of entries) {
      entry.section = section;    // add the section key to each entry
    }
  }
  return menu;
}

const mapStateToProps = (state) => {
  let newMenu = {};
  _.assign(newMenu, controlMenu(state)); // lodash method..

  // Object.keys enumerates the array...
  let order = Object.keys(newMenu);

  if (state.accounts.success) {
    order   = _.union([ PAGES_SECTION ], order);
    _.assign(newMenu, { [PAGES_SECTION]: state.accounts.data }); // ! ES6 ComputedPropertyName
  }

  const dataSource = new ListView.DataSource({
    rowHasChanged:           (r1, r2) => r1.id !== r2.id,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
  });

  return {
    login:      state.login,
    accounts:   state.accounts,
    pages:      state.pages,
    dataSource: dataSource.cloneWithRowsAndSections(buildMenu(newMenu), order)
  }
}

export default connect(mapStateToProps)(ControlPanel)
