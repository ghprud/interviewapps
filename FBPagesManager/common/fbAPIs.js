'use strict'

import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager
} from 'react-native-fbsdk';

export function getPublishPermissions(permissions = []) {
  console.log("get publish permissions");
  return new Promise((resolve, reject) => {
    LoginManager.logInWithPublishPermissions(permissions, (error, result) => {
      if (error) {
        reject('error: ' + error);
      } else {
        if (result.isCancelled) {
          reject('error: login cancelled');
        } else {
          resolve(result);
        }
      }
    });
  });
}

export function logout() {
  return new Promise((resolve) => {
    LoginManager.logOut();
    return resolve();
  });
}

export const accounts = () =>
  graphRequest('/me/accounts', { fields: { string: 'id,name,picture' } })

export const pageDetails  = (pageId) =>
  graphRequest(`/${pageId}`, { fields: { string: 'name,about,category,cover,description,general_info,likes,new_like_count,picture' } })

export const postInsights = (postId) =>
  graphRequest(`/${postId}/insights/post_impressions_unique/lifetime`, { fields: { string: 'name,id,period,values' } })

export const pageToken = (pageId) =>
  graphRequest(`/${pageId}`, { fields: { string: 'access_token' }})

export const sendPost = (pageId, token, fields) => {
  let parameters = {};
  for (let key of Object.keys(fields)) {
    parameters[key] = { string: fields[key].toString() }
  }
  return graphRequest(`/${pageId}/feed`, parameters, token, undefined, 'POST')
}

export const sendScheduledPost = (pageId, token, fields) => { // fields will have timestamp as well...
  let parameters = {};
  for (let key of Object.keys(fields)) {
    parameters[key] = { string: fields[key].toString() }
  }

  console.log("scheduled post");
  console.log(parameters);
  return graphRequest(`/${pageId}/feed`, parameters, token, undefined, 'POST')
}

export const FEED_PUBLISHED   = 'published'
export const FEED_UNPUBLISHED = 'unpublished'
export const FEED_ALL         = 'all'

export const pageFeed = (pageId, postsToShow=FEED_PUBLISHED) => {
  let url    = `/${pageId}`;
  let params = { fields: { string: 'link,message,story,type,attachments,from{name,picture},created_time' },
                 limit:  { string: '4'} };
  if (postsToShow === FEED_PUBLISHED) {
    url += '/feed';
  } else {
    url += '/promotable_posts';
    if (postsToShow !== FEED_ALL) {
      params['is_published'] = { string: 'false' };
    }
  }
  return graphRequest(url, params);
}

// -- the main graphRequest utility function
function graphRequest(path, params, token=undefined, version=undefined, method='GET'){
  let graphRequestConfig = {
    httpMethod: method,
    version: version,
    parameters: params,
    accessToken: token
  }

  return new Promise((resolve, reject) => {
    new GraphRequestManager()
      .addRequest(new GraphRequest(
      path,
      graphRequestConfig,
      (error: ?Object, result: ?Object) => {
        if (error){
          console.log(error);
          reject("error making request. " + error);
        }else{
          resolve(result);
        }
      }
    )).start();
  });
}

// TO DO: This method is inconsistent. Check!
export function checkAccessToken() {
  return new Promise( (resolve, reject) => {
    return AccessToken.getCurrentAccessToken(
      (tokenDetails) => {
        console.log("token details from fb api", tokenDetails);
        if (tokenDetails) {
          return AccessToken.refreshCurrentAccessToken(
            (result) => {
              console.log("result ", result);
              if (result.error) {
                reject(result.error)
              } else {
                // the token has been refreshed
                resolve(tokenDetails)
              }
            })
        } else {
          reject()
        }
      })
  })
}
