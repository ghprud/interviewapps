'use strict'

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Dimensions
} from 'react-native';

import SafariView  from 'react-native-safari-view'
import Icon        from 'react-native-vector-icons/Ionicons'

// -- Redux store related
import { connect }         from 'react-redux'
import * as actionCreators from '../actions'

import TimeAgo   from '../components/timeago'
import ErrorBar  from '../components/errorBar'
import Loading   from '../components/loading'
import NavBar    from '../components/navBar'

let separatorCounter = 0;
const window = Dimensions.get('window');

class HomeScene extends Component {
  componentWillMount() {
    this.reloadPageInfoIfNeeded(this.props.pages);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pages.currentPageId !== this.props.pages.currentPageId) {
      this.reloadPageInfoIfNeeded(nextProps.pages)
    } else if (nextProps.pages.forceReload) {
      this.props.dispatch(actionCreators.forceReloadClear())
      this.reloadPageInfoIfNeeded(nextProps.pages)
    }
  }

  reloadPageInfoIfNeeded(pages) {
    const { dispatch } = this.props

    if (pages.currentPageId) {
      dispatch(actionCreators.pageInfo(pages.currentPageId)).then( () => {
        dispatch(actionCreators.pageContentWithInsights(pages.currentPageId, pages.shown))
      })
    }
  }

  renderSectionHeaderView(sectionData, sectionID) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderTitle}>
          {sectionID}
        </Text>
      </View>
    );
  }

  renderPhoto(photo) {
    var height = window.width * (photo.height / photo.width);
    return (
      <View style={styles.imageBox} key={photo.key}>
        <Image source={{uri: photo.src}} style={{
            width: window.width,
            height: height,
          }}
        />
      </View>
    );
  }

  renderSeparatorView() {
    return (
      <View style={styles.separator} key={separatorCounter++}/>
    );
  }

  renderRowView(entry) {
    let contentView = [];
    if (!entry) { return null }
    switch (entry.type) {
      case "photo":
        let uniquify = 0;
        if (entry.message) {
          contentView.push(
            <View key={entry.id+uniquify} style={styles.textBox}>
              <Text style={styles.text}>{entry.message}</Text>
            </View>
          );
          uniquify++;
        }
        if (entry.attachments && entry.attachments.data) {
          for (let attachment of entry.attachments.data) {
            if (attachment.media && attachment.media.image) {
              contentView.push(this.renderPhoto({link: entry.link, key: entry.id+uniquify, ...attachment.media.image}));
              uniquify++;
            } else if (attachment.subattachments && attachment.subattachments.data) {
              for (let subattachment of attachment.subattachments.data) {
                contentView.push(this.renderPhoto({link: entry.link, key: entry.id+uniquify, ...subattachment.media.image}));
                uniquify++;
              }
            }
          }
        } else {
          console.log("photo: ", entry);
        }
        break;
      case "status":
        contentView.push(
          <View key={entry.id} style={styles.textBox}>
            <Text style={styles.text} key={entry.id}>{entry.message}</Text>
          </View>
        );
        break;
      case "link":
        contentView.push(
          <View key={entry.id} style={styles.textBox}>
            <Text style={styles.text}>
              {entry.message}
            </Text>
            <TouchableOpacity onPress={() => { SafariView.show({url: entry.link}) }}>
              <Text style={styles.link}>
                {entry.link}
              </Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case "video":
        console.log("video", entry);
        break;
      case "offer":
        console.log("offer", entry);
        break;
      default:
        console.log("Unknown type "+entry.type);
        break;
    }

    let story    = entry.story || "";
    let fromName = entry.from.name || "";
    if (story.indexOf(fromName) === 0) {
      story = story.slice(fromName.length);
    }
    let insightsView = null;
    if (entry.insights) {
      if (entry.insights.requesting) {
        insightsView = <Loading viewStyle={styles.loadingInsightsView}
                                textStyle={styles.loadingInsightsText}
                                activitySize="small"
                                activityColor="#ffffff"
                                textMessage="Loading insights"/>;
      } else if (entry.insights.success) {
        if (entry.insights.content) {
          insightsView = <Text style={styles.displayInsightsText}>This post has been viewed by {entry.insights.content.values[0].value} people.</Text>;
        } else {
          insightsView = <Text style={styles.displayInsightsText}>This post has no insights data</Text>;
        }
      } else if (entry.insights.error) {
        insightsView = <Text style={styles.displayInsightsText}>Error querying insights</Text>;
      }
    }
    return (
      <View>
        <View style={ styles.storyHeader } >
          <Image source={{uri:entry.from.picture.data.url}} style={ styles.storyFromImage }/>
          <Text style={ styles.storyDescription }>
            <Text style={ styles.storyFromName }>{fromName}</Text>
            <Text style={ styles.storyStory }>{story}</Text>
          </Text>
          <TimeAgo style={ styles.storyDate } interval={300000} time={entry.safe_created_time}/>
        </View>
        { contentView.map( (item) => { return item; } ) }
        { insightsView }
      </View>
    );
  }

  renderHeader() {
    let details = this.props.pages.pageInfo;
    let about   = details.about || "";
    let source  = details.cover? details.cover.source : "";
    if (about.length > 80) {
      about = about.substring(0,80) + "…";
    }
    return (
      <View style={ styles.headerContainerView }>
        <Image source={{uri: source}} resizeMode="cover" style={ styles.headerCoverImage }>
          <View style={ styles.headerDetailsContainer }>
            <Image source={{uri: details.picture.data.url}} style={ styles.headerPagePicture }/>
            <View>
              <Text style={ styles.headerPageName }>{details.name}</Text>
              <Text style={ styles.headerPageAbout }>{about}</Text>
            </View>
          </View>
        </Image>
      </View>
    );
  }

  loadMoreRows() {
    const { dispatch, pages } = this.props

    if (pages.pagingContext && !pages.requestingNextPage && !pages.error) {
      dispatch(actionCreators.pagingNextWithInsights(pages.pagingContext.next))
    }
  }

  onEndReached() {
    this.loadMoreRows()
  }

  renderActionButton(text, onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={{
          fontFamily: 'System', fontSize: 18, fontWeight: '600', padding: 5, margin: 30,
          textAlign: 'center', color: "#2b3c54", borderColor: "#5A7EB0", borderWidth: 0.5}}>
          { text }
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { dispatch, login, pages } = this.props

    let navBarProps = {
      title:                "Page",
      leftButtonView:       (<Icon name="navicon-round" size={24} color="#5A7EB0" />),
      onLeftPress:          this.props.openDrawer,
      leftButtonStyle:      { alignItems: 'center' },
      buttonContainerStyle: { width: 50, justifyContent: 'center' }
    }

    if (!pages.currentPageId) {
      // Here maybe we do not have the pages_show_list permission?
      if (!login.permission || login.permission.indexOf('pages_show_list') === -1) {
        return (
          <NavBar {...navBarProps}>
            <View style={ styles.textBox }>
              <Text style={{ fontFamily: 'System', fontSize: 18, textAlign: 'center', marginTop: 30 }}>
                Permission to list of managed Pages has not been granted.
              </Text>
              { this.renderActionButton('Logout?', () => { dispatch(actionCreators.logout()) }) }
            </View>
          </NavBar>
        )
      }
      return (
        <NavBar {...navBarProps}>
          <View style={ styles.textBox }>
            <Text style={{ fontFamily: 'System', fontSize: 18, textAlign: 'center'}}>
              No page to manage.
            </Text>
            { this.renderActionButton('Logout?', () => { dispatch(actionCreators.logout()) }) }
          </View>
        </NavBar>
      )
    }

    if (pages.requestingInfo) {
      return (<NavBar {...navBarProps}><Loading textMessage="Getting page details…"/></NavBar>);
    }

    if (pages.requestingContent) {
      return (<NavBar {...navBarProps}><Loading textMessage="Getting page posts…"/></NavBar>);
    }

    let errorBar = null;
    if (pages.successPost) {
      const clearMessage = () => { dispatch(actionCreators.clearPostSent()) }
      errorBar = <ErrorBar green={true} textMessage={"New message sent successfully"}
                           clearCallback={ clearMessage } onPress={ clearMessage }/>;
    }

    if (pages.currentPageId && pages.successInfo) {
      return (
        <NavBar {...navBarProps}>
          { errorBar }
          <ListView
            dataSource={this.props.dataSource}
            renderRow={this.renderRowView.bind(this)}
            renderHeader={this.renderHeader.bind(this)}
            onEndReached={this.onEndReached.bind(this)}
            onEndReachedThreshold={20}
            renderSectionHeader={this.renderSectionHeaderView.bind(this)}
            renderSeparator={this.renderSeparatorView.bind(this)} />
        </NavBar>
      )
    }

    // else
    return (
      <NavBar {...navBarProps}>
        <View style={ styles.textBox }>
          <Text style={{ fontFamily: 'System', fontSize: 18, textAlign: 'center', marginTop: 30}}>
            Error while loading page {pages.error}
          </Text>
          { this.renderActionButton('Refresh?', () => { this.reloadPageInfoIfNeeded(this.props.pages) }) }
        </View>
      </NavBar>
    )
  }
}

// Organise the data for the listView
// with key on the Year for the sections
function buildFeedDataSource(content) {
  let feed = {};
  for (let entry of Object.values(content)) {
    // manually parse the date to get the year "2016-02-24T11:22:22+0000",
    entry.year = entry.created_time.split('-')[0];
    entry.safe_created_time = entry.created_time.slice(0,19);
    // push or create
    (feed[entry.year] = feed[entry.year] || []).push(entry);
  }
  return feed;
}

HomeScene.propTypes = {
  dispatch: PropTypes.func.isRequired,
  login:    PropTypes.object,
  accounts: PropTypes.object,
  pages:    PropTypes.object,
}

const mapStateToProps = (state) => {
  const dataSource = new ListView.DataSource({
    rowHasChanged:           (r1, r2) => r1.id !== r2.id,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
  });

  return {
    login:      state.login,
    accounts:   state.accounts,
    pages:      state.pages,
    dataSource: dataSource.cloneWithRowsAndSections(buildFeedDataSource(state.pages.pageContent))
  }
}

export default connect(mapStateToProps)(HomeScene);

const styles = StyleSheet.create({
  imageBox: {
  },
  storyFromImage: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  storyDescription: {
    marginLeft: 50,
    fontFamily: 'System',
    fontSize: 16,
    paddingBottom: 5,
    paddingTop: 5,
    marginRight: 10,
  },
  storyHeader: {
    height: 55,
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  storyFromName: {
    fontWeight: "600",
  },
  storyStory: {
    fontWeight: "400",
  },
  storyDate: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: "300",
    marginLeft: 50,
  },
  textBox: {
    padding: 10,
    backgroundColor: '#FFF',
  },
  text: {
    fontFamily: 'System',
    fontSize: 18,
  },
  link: {
    fontFamily: 'System',
    fontSize: 18,
    color: "#5A7EB0",
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    backgroundColor: '#e8e8e8',
    padding: 2,
  },
  sectionHeaderTitle: {
    color: '#fff',
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: 'System',
    fontSize: 14,
    color: '#a8a8a8',
  },
  separator: {
    height: 10,
    backgroundColor: '#e8e8e8',
  },
  displayInsightsText: {
    fontFamily: 'System',
    fontSize: 14,
    color: '#a8a8a8',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
    fontStyle: 'italic',
  },
  loadingInsightsView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingInsightsText: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'System',
    fontSize: 14,
    color: '#a8a8a8',
  },
  headerDetailsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  headerContainerView: {
    flex: 1,
    width: window.width,
    height: 160,
    margin: 0, padding: 0,
  },
  headerCoverImage: {
    flex: 1,
    width: window.width,
    resizeMode: 'stretch',
  },
  headerPagePicture: {
    position: 'absolute',
    bottom: 22,
    left: 10,
    width: 50,
    height: 50,
    borderRadius: 2,
  },
  headerPageName: {
    marginLeft: 55,
    color: 'white',
    fontWeight: '500',
    fontSize: 22,
    fontFamily: 'System',
  },
  headerPageAbout: {
    marginLeft: 55,
    color: '#dddddd',
    fontWeight: '400',
    fontFamily: 'System',
    fontSize: 12,
    fontStyle: 'italic'
  },
});
