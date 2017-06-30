# Facebook Page Manager assignment

## Scenes

Each of the scene class renders one of the screen of the application. We will have:
- `controlPanel.js` for the content of the drawer (opened via the "hamburger menu").
- `homeScene.js` renders the content of the Facebook feed for a Page.
- `postScene.js` renders a text input component and allows me to Send a new post (published or unpublised) to my current Page.
- `welcomeSceen.js` renders the screen with the Facebook login button when the user is not connected to Facebook.

## Authorisation flow

The app requires three distinct levels of permissions from Facebook.

The first permission is a read-only set of permissions `read_insights` and `pages_show_list` used to display the main feed. These are requested by the `<Login/>` button from the welcome screen.
- If `pages_show_list` is not granted, the app will be unable to retrieve the list of Pages that the user can manage. The app will display a `Permission to list of managed Pages has not been granted.` message, and propose the user to `logout` (possibly so that the permissions can be granted at next login).
- If `read_insights` is not granted, the app will not be able to retrieve the insights (number of people that have viewed each posts), but it will still query for them (FIXME?). No error message will be displayed, and no insight data will be available in the app.

The second permission `manage_pages` allows to see unpublished posts. It can be first requested when the user toggle the display of unpublished posts from the drawer; or when the user click on the New Post button in the tab bar.

The third permission `publish_pages` is required to post on behalf of the Page. It is requested when the user tap the New Post button in the tab bar. The New Post button requests both `manage_pages` and `publish_pages` (as both are required for the full post functionality); therefore asking to see unpublished posts from the drawer after tapping New Post will not trigger a new permission request screen.
