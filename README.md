# generator-angular-widget
`generator-angular-widget` is a [Yeoman](http://yeoman.io/) generator for quickly creating the boilerplate for a shareable Angular modules.  These modules can be developed in isolation and later consumed by an independent host application.  

This template uses [SystemJS](https://github.com/systemjs/systemjs) for script loading.  Any consuming application will also need to use SystemJS. 

## Getting started
- Install Yeoman, jspm, and `generator-angular-widget` globally: `npm install yo jspm generator-angular-widget -g` 
- Run the generator: `yo angular-widget`
- Point your local development server at the `dev-build` directory

## Sharing your widget
Once you have your Angular widget working in isolation, create a distribution build using `gulp build-deploy`.  This will copy all relevant files into the `dist` directory, ready for consumption.  Because these files will be consumed by other Angular apps before they are deployed to a live environment, no minification or concatenation is performed on these files.  The application the consumes these files is responsible for concatenation/minification.

To use your widget in a host application, add your widget's module as a jspm dependency of the host:

```
jspm install my-widget=github:your-github-username/your-widgets-repo-name
```

Or, if using a private git server (for example, a private GitLab instace), [create a custom jspm registry](http://jspm.io/docs/registries.html) using [jspm-git](https://www.npmjs.com/package/jspm-git).  For other use cases, see http://jspm.io/docs/registries.html. 

Then, in your host application, you can import your widget's Angular module like so:

```javascript
import {myWidgetModule} from 'my-widget';

var myHostModule = angular.module('HostModule', [myWidgetModule.name]);
```  

Your host now has full access to your widget's module, as if the module lived directly in the host.

## Troubleshooting

__I'm getting a "fatal: Could not read from remote repository" error message when running `jspm install`.__
If you're behind a corporate proxy, you may need to create HTTP_PROXY and HTTPS_PROXY environment variables to allow jspm to fetch dependencies from GitHub.

__I'm getting a "GitHub rate limit reached" when running `jspm install`.__
See http://stackoverflow.com/a/30995041/1063392.  Make sure to give your access token the `public_repo` scope. 

## Some other notes
- Any images or other assets (fonts, video, audio, etc) should __not__ be placed at the root of `app/assets`; instead, they should be placed in `app/assets/widget-name`.  See `assets/WhereToPutAssets.md` for more information. 