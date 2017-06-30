'use strict'

// -- React components
import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import Drawer from 'react-native-drawer'
import Icon   from 'react-native-vector-icons/Ionicons'

// -- Redux store related
import { connect }         from 'react-redux'
import * as actionCreators from './actions'

// -- My scenes
import ControlPanel  from './scenes/controlPanel'
import WelcomeScene  from './scenes/welcomeScene'
import HomeScene     from './scenes/homeScene'
import PostScene     from './scenes/postScene'

// -- My components
import Loading       from './components/loading'

// -- The main class of the application
class Root extends Component {

  // those closures can be passed down to control the drawer state from a subcomponent
  closeDrawer = () => { this.refs.drawer.close() };
  openDrawer  = () => { this.refs.drawer.open()  };

  // we have a constructor to maintain the selected tab in the state of the class
  constructor(props) {
    super(props);

    this.defaultTab = 'Page';

    this.state = {
      selectedTab: this.defaultTab,
    };
  }

  // another closure to go back to the default "Feed" (Home) tab
  gotoDefaultTab() {
    this.setState({ selectedTab: this.defaultTab });
  }

  // convenience function to return a TabBarItem
  makeTabItem(options) {
    let route = <HomeScene openDrawer={ this.openDrawer.bind(this) }/>;
    if (options.route === 'Post') {
      route = <PostScene gotoDefaultTab={ this.gotoDefaultTab.bind(this) }/>;
    }

    // here I use *Icon*.TabBarItem to be able to use a direct Icon reference
    // from the react-native-vector-icons/Ionicons library.
    return (
      <Icon.TabBarItem title={ options.title }
                          selected={ this.state.selectedTab === options.title }
                          onPress={() => { this.setState({ selectedTab: options.title }); }}
                          iconName={ options.iconName }
                          selectedIconName={ options.selectedIconName }
                          iconSize={ 30 }>
        { route }
      </Icon.TabBarItem>
    );
  }

  // used to validate the existing Facebook token (if any)
  componentWillMount() {
    const { dispatch, login } = this.props

    // check the token, and do nothing with the Promise (as exceptions will be handled
    // via the redux state in the render function)
    // note: not passing an empty function (Function.prototype), yield an error
    dispatch(actionCreators.checkAppToken()).then( Function.prototype ).catch( Function.prototype );
  }

  // used to request the list of accounts (Pages), and auto-select the first one.
  componentWillReceiveProps(props) {
    const { dispatch, login, accounts, pages } = props // ! the new props to be

    if (login.success && !accounts.success && !this.props.accounts.requesting) {
      // we just logged in, and we do not have accounts, nor are we currently requesting
      // then do request accounts list.
      dispatch(actionCreators.accounts())
    } else if (login.success && accounts.success && !pages.currentPageId) {
      // automatically select the first account if nothing is selected
      let newPageId = undefined;
      if (accounts.data && accounts.data.length > 0) {
        newPageId = accounts.data[0].id;
      }
      if (newPageId) {
        dispatch(actionCreators.pageSetCurrent(newPageId))
      }
    }
  }

  // the main render method will render the Drawer + TabBar + HomeScene if we
  // are logged in Facebook, and the Welcome screen if we are not.
  render() {
    console.log("in the root's render");
    const { dispatch, login, accounts } = this.props

    // the initial loading pages
    // we might need a better logic to allow user to retry if he gets stuck
    // on one of those screens for a long time…
    if (login.requesting) {
      return (<Loading textMessage="Connecting to Facebook…"/>);
    } else if (login.success && (!accounts.success || accounts.requesting)) {
      return (<Loading textMessage="Requesting list of accounts…"/>);
    }

    // If we are not logged in, display a welcome / login screen
    if (! login.success) {
      console.log("in the root");
      return ( <WelcomeScene/> );
    } else {
      console.log("in the drawer");
      return (
        <Drawer ref="drawer"
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                tweenHandler={Drawer.tweenPresets.parallax}
                tapToClose={true}
                content={<ControlPanel closeDrawer={ this.closeDrawer.bind(this) }/>}>
          <TabBarIOS>
            { this.makeTabItem({ title:            'Page',
                                 iconName:         'ios-list-outline',
                                 selectedIconName: 'ios-list',
                                 route:            'Home' }) }

            { this.makeTabItem({ title:            'New Post',
                                 iconName:         'ios-plus-outline',
                                 selectedIconName: 'ios-plus',
                                 route:            'Post' })}
          </TabBarIOS>
        </Drawer>
      );
    }
  }
}

Root.propTypes = {
  dispatch: PropTypes.func.isRequired,
  login:    PropTypes.object.isRequired,
  accounts: PropTypes.object.isRequired,
  pages:    PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    login:    state.login,
    accounts: state.accounts,
    pages:    state.pages,
  }
}

export default connect(mapStateToProps)(Root);

// +TODO: maybe merge all the styles together in an external file
const drawerStyle = {
  shadowColor: "#000000",
  shadowOpacity: 0.4,
  shadowRadius: 3,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigator: {
    flex: 1,
  },
  navBar:{
    backgroundColor: '#f8f8f8',
    borderBottomColor: '#c8c8c8',
    borderBottomWidth: 1
  },
  scene: {
    paddingTop: 64,
  },
});
