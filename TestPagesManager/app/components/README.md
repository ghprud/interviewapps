# Facebook Page Manager assignment

## Components

The components are mostly simple elements (with the exception of `login.js`).

- `errorBar.js` is used to display a small red or green status bar on top of a screen. That status bar will close on tap, or after a timeout of 20 sec.
- `loading.js` shows the standard Activity Indicator with a text message. It is used during actions that are waiting for information from a remote site (Facebook).
- `navBar.js` is used to create a pseudo-navigation bar on top of the screen. It can display a button on the left and a button on the right, along with a title. There is no actual navigation in the app today, so the pseudo-navigation component is fine.
- `timeago.js` is a component to wrap around the [`moment`](http://momentjs.com) library. It display a date in a human readable format.

- `login.js` is not a simple component as it dispatches actions to the store. It is used to display the standard Facebook login button and dispatches the relevant action from the result of the login action.

