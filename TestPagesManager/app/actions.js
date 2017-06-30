'use strict'

import * as facebookAPI from './facebookAPI'

// -- all of my actions types, useful to get notified of typos
export const LOGIN_REQUEST               = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS               = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE               = 'LOGIN_FAILURE'
export const LOGOUT_REQUEST              = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS              = 'LOGOUT_SUCCESS'
export const APP_TOKEN_CHECK             = 'APP_TOKEN_CHECK'
export const APP_TOKEN_SUCCESS           = 'APP_TOKEN_SUCCESS'
export const APP_TOKEN_FAILURE           = 'APP_TOKEN_FAILURE'
export const ACCOUNTS_FETCH              = 'ACCOUNTS_FETCH'
export const ACCOUNTS_FETCH_SUCCESS      = 'ACCOUNTS_FETCH_SUCCESS'
export const ACCOUNTS_FETCH_FAILURE      = 'ACCOUNTS_FETCH_FAILURE'
export const PAGE_SET_CURRENT            = 'PAGE_SET_CURRENT'
export const PAGEINFO_FETCH              = 'PAGEINFO_FETCH'
export const PAGEINFO_FETCH_SUCCESS      = 'PAGEINFO_FETCH_SUCCESS'
export const PAGEINFO_FETCH_FAILURE      = 'PAGEINFO_FETCH_FAILURE'
export const PAGECONTENT_FETCH           = 'PAGECONTENT_FETCH'
export const PAGECONTENT_FETCH_SUCCESS   = 'PAGECONTENT_FETCH_SUCCESS'
export const PAGECONTENT_FETCH_FAILURE   = 'PAGECONTENT_FETCH_FAILURE'
export const PAGING_NEXT_FETCH           = 'PAGING_NEXT_FETCH'
export const PAGING_NEXT_FETCH_SUCCESS   = 'PAGING_NEXT_FETCH_SUCCESS'
export const PAGING_NEXT_FETCH_FAILURE   = 'PAGING_NEXT_FETCH_FAILURE'
export const POSTINSIGHTS_FETCH          = 'POSTINSIGHTS_FETCH'
export const POSTINSIGHTS_FETCH_SUCCESS  = 'POSTINSIGHTS_FETCH_SUCCESS'
export const POSTINSIGHTS_FETCH_FAILURE  = 'POSTINSIGHTS_FETCH_FAILURE'
export const PUBLISH_PERMISSIONS_FETCH   = 'PUBLISH_PERMISSIONS_FETCH'
export const PUBLISH_PERMISSIONS_SUCCESS = 'PUBLISH_PERMISSIONS_SUCCESS'
export const PUBLISH_PERMISSIONS_FAILURE = 'PUBLISH_PERMISSIONS_FAILURE'
export const PAGE_TOKEN_FETCH            = 'PAGE_TOKEN_FETCH'
export const PAGE_TOKEN_FETCH_SUCCESS    = 'PAGE_TOKEN_FETCH_SUCCESS'
export const PAGE_TOKEN_FETCH_FAILURE    = 'PAGE_TOKEN_FETCH_FAILURE'
export const POST_SEND                   = 'POST_SEND'
export const POST_SEND_SUCCESS           = 'POST_SEND_SUCCESS'
export const POST_SEND_FAILURE           = 'POST_SEND_FAILURE'
export const TOKEN_ERRORS_CLEAR          = 'TOKEN_ERRORS_CLEAR'
export const POST_ERRORS_CLEAR           = 'POST_ERRORS_CLEAR'
export const POST_SENT_CLEAR             = 'POST_SENT_CLEAR'
export const FORCE_RELOAD_CLEAR          = 'FORCE_RELOAD_CLEAR'

// -- action creators: Login
export const loginRequest    = ()        => ({type: LOGIN_REQUEST})
export const loginSuccess    = (result)  => ({type: LOGIN_SUCCESS, result})
export const logoutRequest   = ()        => ({type: LOGOUT_REQUEST})
export const logoutSuccess   = ()        => ({type: LOGOUT_SUCCESS})
export const loginFailure    = (error)   => ({type: LOGIN_FAILURE, error})

export const appTokenCheck   = ()             => ({type: APP_TOKEN_CHECK})
export const appTokenSuccess = (tokenDetails) => ({type: APP_TOKEN_SUCCESS, tokenDetails})
export const appTokenFailure = (error)        => ({type: APP_TOKEN_FAILURE, error})

export const pageSetCurrent   = (pageid)=> ({type: PAGE_SET_CURRENT, pageid})
export const forceReloadClear = ()      => ({type: FORCE_RELOAD_CLEAR})

// -- action creators: Page
const accountsFetch        = ()         => ({type: ACCOUNTS_FETCH})
const accountsFetchSuccess = (accounts) => ({type: ACCOUNTS_FETCH_SUCCESS, accounts})
const accountsFetchFailure = (error)    => ({type: ACCOUNTS_FETCH_FAILURE, error})
const pageinfoFetch        = ()         => ({type: PAGEINFO_FETCH})
const pageinfoFetchSuccess = (pageinfo) => ({type: PAGEINFO_FETCH_SUCCESS, pageinfo})
const pageinfoFetchFailure = (error)    => ({type: PAGEINFO_FETCH_FAILURE, error})

const pagingNextFetch        = ()                  => ({type: PAGING_NEXT_FETCH})
const pagingNextFetchSuccess = (additionalContent) => ({type: PAGING_NEXT_FETCH_SUCCESS, additionalContent})
const pagingNextFetchFailure = (error)             => ({type: PAGING_NEXT_FETCH_FAILURE, error})

const pagecontentFetch        = ()                   => ({type: PAGECONTENT_FETCH})
const pagecontentFetchSuccess = (pagecontent, shown) => ({
  type: PAGECONTENT_FETCH_SUCCESS,
  pagecontent,
  shown
})
const pagecontentFetchFailure = (error)       => ({type: PAGECONTENT_FETCH_FAILURE, error})

// -- action creators: Posts insights
const postinsightsFetch        = (postid) => ({
  type: POSTINSIGHTS_FETCH,
  postid,
})
const postinsightsFetchSuccess = (postid, postinsights) => ({
  type: POSTINSIGHTS_FETCH_SUCCESS,
  postid,
  postinsights,
})
const postinsightsFetchFailure = (postid, error) => ({
  type: POSTINSIGHTS_FETCH_FAILURE,
  postid,
  error,
})

// -- action creators: Publish and Page Token
const publishPermissionsFetch    = ()       => ({type: PUBLISH_PERMISSIONS_FETCH})
const publishPermissionsSuccess  = (result) => ({type: PUBLISH_PERMISSIONS_SUCCESS, result})
const publishPermissionsFailure  = (error)  => ({type: PUBLISH_PERMISSIONS_FAILURE, error})
const pageTokenFetch             = ()       => ({type: PAGE_TOKEN_FETCH})
const pageTokenFetchSuccess      = (pageid, result) => ({type: PAGE_TOKEN_FETCH_SUCCESS, pageid, result})
const pageTokenFetchFailure      = (pageid, error)  => ({type: PAGE_TOKEN_FETCH_FAILURE, pageid, error})

// -- action creators: Posting
const postSend            = ()       => ({type: POST_SEND})
const postSendSuccess     = (result) => ({type: POST_SEND_SUCCESS, result})
const postSendFailure     = (error)  => ({type: POST_SEND_FAILURE, error})

// -- action creators: Clearing messages
const tokenErrorsClear    = () => ({type: TOKEN_ERRORS_CLEAR})
const postErrorsClear     = () => ({type: POST_ERRORS_CLEAR})
const postSentClear       = () => ({type: POST_SENT_CLEAR})

// -- action methods

export function logout() {
  return dispatch => {
    dispatch(logoutRequest())
    facebookAPI.logout().then(() => {
      dispatch(logoutSuccess())
    })
  }
}

export function getInfo() {
  return dispatch => {
    dispatch(loginRequest())
    facebookAPI.getInfo().then(() => {
      dispatch(loginSuccess())
    }).catch(() => {
      dispatch(logoutSuccess())
    })
  }
}

export function accounts() {
  return dispatch => {
    dispatch(accountsFetch())
    facebookAPI.accounts().then((accounts) => {
      dispatch(accountsFetchSuccess(accounts))
    }).catch((error) => {
      dispatch(accountsFetchFailure(error))
    })
  }
}

export function clearTokenErrors() {
  return dispatch => { dispatch(tokenErrorsClear()) }
}

export function clearPostErrors() {
  return dispatch => { dispatch(postErrorsClear()) }
}

export function clearPostSent() {
  return dispatch => { dispatch(postSentClear()) }
}

// -- action methods returning Promises

export function checkAppToken() {
  return dispatch => {
    dispatch(appTokenCheck())
    return new Promise( (resolve, reject) => {
      facebookAPI.checkAccessToken().then( (tokenDetails) => {
        dispatch(appTokenSuccess(tokenDetails))
        resolve()
      }).catch( (error) => {
        dispatch(appTokenFailure(error))
        reject(error)
      })
    })
  }
}

export function pageInfo(pageId) {
  return dispatch => {
    dispatch(pageinfoFetch())
    return new Promise( (resolve, reject) => {
      facebookAPI.pageDetails(pageId).then((pageDetails) => {
        dispatch(pageinfoFetchSuccess(pageDetails))
        resolve()
      }).catch((error) => {
        dispatch(pageinfoFetchFailure(error))
        reject(error)
      })
    })
  }
}

export function pageContent(pageId, postsToShow=facebookAPI.FEED_PUBLISHED) {
  return dispatch => {
    dispatch(pagecontentFetch())
    return new Promise( (resolve, reject) => {
      facebookAPI.pageFeed(pageId, postsToShow).then((pageContent) => {
        dispatch(pagecontentFetchSuccess(pageContent, postsToShow))
        resolve(pageContent)
      }).catch((error) => {
        dispatch(pagecontentFetchFailure(error))
        reject(error)
      })
    })
  }
}

export function pagingNext(nextPageURL) {
  return dispatch => {
    dispatch(pagingNextFetch())
    return new Promise( (resolve, reject) => {
      fetch(nextPageURL).then(r => r.json())
        .then( (data) => {
          dispatch(pagingNextFetchSuccess(data))
          resolve(data)
        })
        .catch( (error) => {
          dispatch(pagingNextFetchFailure(error))
          reject(error)
        })
    })
  }
}

export function pagingNextWithInsights(nextPageURL) {
  return dispatch => {
    return new Promise( (resolve, reject) => {
      dispatch(pagingNext(nextPageURL)).then( (newContent) => {
        for (let entry of newContent.data) {
          if (entry.id) {
            dispatch(postInsights(entry.id))
          }
        }
        resolve(newContent)
      }).catch( (error) => { reject(error) })
    })
  }
}

export function postInsights(postId) {
  return dispatch => {
    dispatch(postinsightsFetch(postId))
    return new Promise( (resolve, reject) => {
      facebookAPI.postInsights(postId).then((postInsights) => {
        dispatch(postinsightsFetchSuccess(postId, postInsights))
        resolve(postInsights)
      }).catch((error) => {
        dispatch(postinsightsFetchFailure(postId, error))
        reject(error)
      })
    })
  }
}

// -- special function to bundle pageContent and postInsights
export function pageContentWithInsights(pageId, postsToShow=facebookAPI.FEED_PUBLISHED) {
  return dispatch => {
    return new Promise ( (resolve, reject) => {
      dispatch(pageContent(pageId, postsToShow)).then( (newContent) => {
        for (let entry of Object.values(newContent.data)) {
          if (entry.id) {
            dispatch(postInsights(entry.id))
          }
        }
        resolve(newContent)
      }).catch( (error) => { reject(error) })
    })
  }
}

export function requestPublishPermissions(permissions=['manage_pages','publish_pages']) {
  return dispatch => {
    dispatch(publishPermissionsFetch())
    return new Promise( (resolve, reject) => {
      facebookAPI.getPublishPermissions(permissions).then( (result) => {
        dispatch(publishPermissionsSuccess(result))
        resolve(result)
      }).catch( (error) => {
        dispatch(publishPermissionsFailure(error))
        reject(error)
      })
    })
  }
}

export function getPageToken(pageId) {
  return dispatch => {
    dispatch(pageTokenFetch())
    return new Promise( (resolve, reject) => {
      facebookAPI.pageToken(pageId).then( (result) => {
        dispatch(pageTokenFetchSuccess(pageId, result))
        resolve(result)
      }).catch( (error) => {
        dispatch(pageTokenFetchFailure(error))
        reject(pageId, error)
      })
    })
  }
}

export function sendPost(pageId, token, parameters) {
  return dispatch => {
    dispatch(postSend())
    return new Promise( (resolve, reject) => {
      facebookAPI.sendPost(pageId, token, parameters).then((result) => {
        dispatch(postSendSuccess(result))
        resolve(result)
      }).catch((error) => {
        dispatch(postSendFailure(error))
        reject(error)
      })
    })
  }
}
