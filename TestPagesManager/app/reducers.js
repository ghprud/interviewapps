'use strict'

import _ from 'lodash'

// From here, we mutate the global Redux stores.
// The reducers are triggered from dispatched Actions.
import { combineReducers } from 'redux'
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  APP_TOKEN_FAILURE,
  APP_TOKEN_SUCCESS,
  APP_TOKEN_CHECK,
  ACCOUNTS_FETCH,
  ACCOUNTS_FETCH_SUCCESS,
  ACCOUNTS_FETCH_FAILURE,
  PAGE_SET_CURRENT,
  PAGEINFO_FETCH,
  PAGEINFO_FETCH_SUCCESS,
  PAGEINFO_FETCH_FAILURE,
  PAGECONTENT_FETCH,
  PAGECONTENT_FETCH_SUCCESS,
  PAGECONTENT_FETCH_FAILURE,
  PAGING_NEXT_FETCH,
  PAGING_NEXT_FETCH_SUCCESS,
  PAGING_NEXT_FETCH_FAILURE,
  POSTINSIGHTS_FETCH,
  POSTINSIGHTS_FETCH_SUCCESS,
  POSTINSIGHTS_FETCH_FAILURE,
  PUBLISH_PERMISSIONS_FETCH,
  PUBLISH_PERMISSIONS_SUCCESS,
  PUBLISH_PERMISSIONS_FAILURE,
  PAGE_TOKEN_FETCH,
  PAGE_TOKEN_FETCH_SUCCESS,
  PAGE_TOKEN_FETCH_FAILURE,
  POST_SEND,
  POST_SEND_SUCCESS,
  POST_SEND_FAILURE,
  TOKEN_ERRORS_CLEAR,
  POST_ERRORS_CLEAR,
  POST_SENT_CLEAR,
  FORCE_RELOAD_CLEAR,
} from './actions'

import {
  FEED_PUBLISHED
} from './facebookAPI'

// the Login store
const initialLoginState = {
  requesting:          false,
  success:             false,
  error:               null,
  permissions:         null,
  declinedPermissions: null,
  tokenString:         null,
  userID:              null,
}

const login = (state = initialLoginState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case APP_TOKEN_CHECK:
      return Object.assign({}, state, {
        requesting:          true,
        success:             false,
        error:               null,
      })
    case LOGIN_SUCCESS:
    case PUBLISH_PERMISSIONS_SUCCESS:
      return Object.assign({}, state, {
        requesting:          false,
        success:             true,
        error:               null,
        permissions:         action.result.grantedPermissions,
        declinedPermissions: action.result.declinedPermissions,
      })
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, initialLoginState)
    case LOGIN_FAILURE:
    case APP_TOKEN_FAILURE:
      return Object.assign({}, state, {
        requesting:          false,
        success:             false,
        error:               action.error,
        permissions:         null,
        declinedPermissions: null,
        tokenString:         null,
        userID:              null,
      })
    case APP_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        requesting:          false,
        success:             true,
        error:               null,
        permissions:         action.tokenDetails.permissions,
        declinedPermissions: action.tokenDetails.declinedPermissions,
        tokenString:         action.tokenDetails.tokenString,
        userID:              action.tokenDetails.userID,
      })
    default:
      return state;
  }
}

// the Accounts store (list of Pages)
const initialAccountsState = {
  requesting: false,
  success:    false,
  error:      null,
}

const accounts = (state = initialAccountsState, action) => {
  switch (action.type) {
    case ACCOUNTS_FETCH:
      return Object.assign({}, state, {
        success:    false,
        requesting: true,
        error:      null,
      })
    case ACCOUNTS_FETCH_FAILURE:
      return Object.assign({}, state, {
        success:    false,
        requesting: false,
        error:      action.error,
      })
    case ACCOUNTS_FETCH_SUCCESS:
      return Object.assign({}, state, {
        success:    true,
        requesting: false,
        error:      null,
        data:       action.accounts.data,
      })
    default:
      return state;
  }
}

// the Pages store
const initialPagesState = {
  currentPageId:         undefined,
  // all about showing the current page and its header
  pageInfo:              {},
  pageContent:           [],
  pagingContext:         null,
  requestingInfo:        false,
  successInfo:           false,
  requestingContent:     false,
  successContent:        false,
  shown:                 FEED_PUBLISHED, // from facebookAPI
  error:                 null,
  // Page token related
  pageToken:             {},    // +FIXME: should the token be Page specific?
  requestingToken:       false,
  successToken:          false,
  errorToken:            null,
  // sending post related
  sendingPost:           false,
  successPost:           false,
  lastSentPostId:        null,
  errorPost:             null,
  forceReload:           false,
}

function apppendInsights(contentList, postId, insights) {
  let newContentList = contentList.slice(0)
  for (let item of newContentList) {
    if (item.id === postId) {
      item.insights = insights;
      break;
    }
  }
  return newContentList;
}

const pages = (state = initialPagesState, action) => {
  switch (action.type) {
    case PAGE_SET_CURRENT:
      return Object.assign({}, state, {
        currentPageId:     action.pageid,
        pageInfo:          {},
        pageContent:       {},
        pagingContext:     null,
        requestingInfo:    false,
        successInfo:       false,
        requestingContent: false,
        successContent:    false,
        error:             null,
        successPost:       false,
        errorPost:         null,
        errorToken:        null,
        forceReload:       true,
      })
    case PAGEINFO_FETCH:
      return Object.assign({}, state, {
        requestingInfo:    true,
        successInfo:       false,
        error:             null,
        forceReload:       false,
      })
    case PAGEINFO_FETCH_SUCCESS:
      return Object.assign({}, state, {
        requestingInfo:    false,
        successInfo:       true,
        error:             null,
        pageInfo:          action.pageinfo,
        forceReload:       false,
      })
    case PAGEINFO_FETCH_FAILURE:
      return Object.assign({}, state, {
        requestingInfo:    false,
        successInfo:       false,
        error:             action.error,
        forceReload:       false,
      })
    case PAGECONTENT_FETCH:
      return Object.assign({}, state, {
        requestingContent:    true,
        requestingNextPage:   false,
        successContent:       false,
        error:                null,
        forceReload:          false,
      })
    case PAGECONTENT_FETCH_SUCCESS:
      return Object.assign({}, state, {
        requestingContent:    false,
        requestingNextPage:   false,
        successContent:       true,
        error:                null,
        pageContent:          action.pagecontent.data,
        pagingContext:        action.pagecontent.paging,
        shown:                action.shown,
        forceReload:          false,
      })
    case PAGECONTENT_FETCH_FAILURE:
      return Object.assign({}, state, {
        requestingContent:    false,
        requestingNextPage:   false,
        successContent:       false,
        error:                action.error,
        forceReload:          false,
      })
    case PAGING_NEXT_FETCH:
      return Object.assign({}, state, {
        requestingContent:    false,
        requestingNextPage:   true,
        successContent:       false,
        error:                null,
        forceReload:          false,
      })
    case PAGING_NEXT_FETCH_SUCCESS:
      return Object.assign({}, state, {
        requestingContent:    false,
        requestingNextPage:   false,
        successContent:       true,
        error:                null,
        pageContent:          _.concat(state.pageContent, action.additionalContent.data),
        pagingContext:        action.additionalContent.paging,
        forceReload:          false,
      })
    case PAGING_NEXT_FETCH_FAILURE:
      return Object.assign({}, state, {
        requestingContent:    false,
        requestingNextPage:   false,
        successContent:       false,
        error:                action.error,
        forceReload:          false,
      })
    case POSTINSIGHTS_FETCH:
      return Object.assign({}, state, {
        pageContent: apppendInsights(
          state.pageContent,
          action.postid,
          { requesting: true, success: false, error: null })
      })
    case POSTINSIGHTS_FETCH_SUCCESS:
      return Object.assign({}, state, {
        pageContent: apppendInsights(
          state.pageContent,
          action.postid,
          { requesting: false, success: true, error: null, content: action.postinsights.data[0]})
      })
    case POSTINSIGHTS_FETCH_FAILURE:
      return Object.assign({}, state, {
        pageContent: apppendInsights(
          state.pageContent,
          action.postid,
          { requesting: false, success: false, error: action.error })
      })
    case PAGE_TOKEN_FETCH:
      return Object.assign({}, state, {
        requestingToken:   true,
        successToken:      false,
        errorToken:        null,
      })
    case PAGE_TOKEN_FETCH_SUCCESS:
      return Object.assign({}, state, {
        requestingToken:   false,
        successToken:      true,
        errorToken:        null,
        pageToken:         { [action.pageid]: action.result.access_token },
      })
    case PAGE_TOKEN_FETCH_FAILURE:
      return Object.assign({}, state, {
        requestingToken:   false,
        successToken:      false,
        errorToken:        action.error,
        pageToken:         { [action.pageid]: undefined },
      })
    case POST_SEND:
      return Object.assign({}, state, {
        sendingPost:       true,
        successPost:       false,
        errorPost:         null,
        lastSentPostId:    null,
        forceReload:       false,
      })
    case POST_SEND_SUCCESS:
      return Object.assign({}, state, {
        sendingPost:       false,
        successPost:       true,
        errorPost:         null,
        lastSentPostId:    action.result,
        forceReload:       true,
      })
    case POST_SEND_FAILURE:
      return Object.assign({}, state, {
        sendingPost:       false,
        successPost:       false,
        errorPost:         action.error,
        lastSentPostId:    null,
        forceReload:       false,
      })
    case TOKEN_ERRORS_CLEAR:
    case POST_ERRORS_CLEAR:
      return Object.assign({}, state, {
        errorPost:        null,
        errorToken:       null,
        forceReload:      false,
      })
    case POST_SENT_CLEAR:
      return Object.assign({}, state, {
        successPost:      false,
        forceReload:      false,
      })
    case FORCE_RELOAD_CLEAR:
      return Object.assign({}, state, {
        forceReload:      false,
      })
    default:
      return state;
  }
}

// -- combine and export
const rootReducer = combineReducers({ login, accounts, pages });
export default rootReducer
