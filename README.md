# generator-angular-cmelion  [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

> [generator-angular-cmelion] - An opinionated kickstarter for your next large scale AngularJS application.
Avoid boilerplate and improve productivity and consistency.


---

## Features
- Lightweight SASS only (no Compass and no jQuery) version of https://github.com/kennethlynne/generator-angular-xl
- Additional `optimizations` are pending
- All scripts in `app/scrips`, `app/components` and `app/pages` and styles in `app/styles` will be automatically included in minifiers, index.html and tests. Specify configuration once and share it between *all the things*. Need more control? Check out [resources.json](#resources.json).
- Controllers, views and styling are grouped on a per component and page basis to facilitate high cohesion.
- Test coverage using [Istanbul](http://gotwarlost.github.io/istanbul/) helps you find exactly what the lines of code that are tested or not. See an [example output](http://gotwarlost.github.io/istanbul/public/coverage/lcov-report/index.html)
- Use [components](#component) as syntactic sugar to use directives as web components with a convention over configuration approach
- Start a server with live reload, easily monitoring your progress with ```grunt server```
- Run tests continually when implementing using KarmaJS using ```grunt test```
- Build and minify the project with one command: ```grunt build```
- Deploy to your [GitHub page](http://pages.github.com/) in one command: ```grunt deploy```
- Intercept calls to an API and provide a [mock API](#crud-mock) to do fast prototyping

- Generate `manifest.appcache` to allow your application to be consumed offline. It will handle busting cache for you by renaming files and adding a hash of the folder to the manifest.

Maintainer: [Charles Fulnecky](https://github.com/cmelion)

Based on [generator-angular-xl](https://github.com/kennethlynne/generator-angular-xl) and [angular-seed](https://github.com/angular/angular-seed/) and [generator-angular](https://github.com/yeoman/generator-angular).

## Quick start

Install SASS with GEM, then run:

Install Node.js with npm, then run:

```
npm install -g generator-angular-cmelion
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo angular-cmelion`, with your application name:
```
yo angular-cmelion app-name
```

Run `grunt server` to start the local server.

Open another terminal and run `grunt exec:sass_dev`

*Awesomeness ensues*

# Developing with the generator

## Available Grunt tasks

`grunt server` to run a test server with live reload.
`grunt test` to run tests once (`karma start` to run tests coninously and rerun tests on file change)
`grunt changelog` - bumps version numbers in `bower.json` and `package.json` and creates a changelog based on your commit history using [these](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit) conventions

The following commands will build the application into the `/dist` folder.
* `grunt build` - production profile, minified, concatinated and awesomified for production
* `grunt build:dev` - development profile, unminified code
* `grunt build:prototype` - same as dev profile, only stubbing out the API witch in turn makes this app a prototype :)

# Deploy
* `grunt deploy` - takes whatever lies in the `/dist` folder and pushes it to the `gh-pages` branch, making whatever build you run before available to the world to see at `<your-username>.github.io/<your-repository>/`

## Generators

Available generators:

* [angular-cmelion](#app) (aka [angular-cmelion:app](#app))
* [angular-cmelion:crud-mock](#crud-mock)
* [angular-cmelion:controller](#controller)
* [angular-cmelion:directive](#directive)
* [angular-cmelion:component](#component)
* [angular-cmelion:filter](#filter)
* [angular-cmelion:page](#page)
* [angular-cmelion:service](#service)
* [angular-cmelion:provider](#service)
* [angular-cmelion:factory](#service)
* [angular-cmelion:repository](#repository)
* [angular-cmelion:value](#service)
* [angular-cmelion:constant](#service)
* [angular-cmelion:decorator](#decorator)

**Note: Generators are to be run from the root directory of your app.**


### Module
`app/scripts/module.js` contains the applications main module definition. All dependancies for your application needs to be specified here.

### App
Sets up a new AngularJS app, generating all the boilerplate you need to get started. The app generator also installs Twitter Bootstrap and additional AngularJS modules.

Example:
```bash
yo angular-cmelion
```

### CRUD-Mock
Prototype fast before the API is implemented, but implement like the API already exists.

```bash
yo angular-cmelion:crud-mock user
```

Creates a mock CRUD API in the dev folder of your project.
It will automatically intercept all calls done through ```$http``` to the API and reply with data after the given delay, when ever you are ready to implement with a real API set ```useMocks: false``` in `config/config.js`

### Page
Pages are located under `app/pages`. A page basically is a controller, with a view and page specific styling. Routes are specified using the powerful Angular-UI Route API in the config section in the controller.

Example:
```bash
yo angular-cmelion:page user
```

Produces `app/pages/user/index/user.js`, `test/spec/pages/user/index/user.js`, `app/pages/user/index/views/user.html` and `app/pages/user/styles/_user.scss`

### Routing
Routes are configured in `app/config/routes.js`. Each individual controller registers its own route.

### Controller
Generates a controller in `app/pages` and an accompanying test in `test/spec/pages`.
Every controller is generated with an accompanying initService, that is responsible for fetching data and returning a promise. This helps you load data *before* the controller is instantiated.

Example:
```bash
yo angular-cmelion:controller user
```

### Directive
Generates a directive in `app/scripts/directives`.

Example:
```bash
yo angular-cmelion:directive myDirective
```

Produces `app/scripts/directives/my-directive.js`:
```javascript
angular.module('myMod').directive('myDirective', function () {
  return {
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      element.text('this is the myDirective directive');
    }
  };
});
```
### Component
A component is basically a element directive that by convention use a view located in `app/views/component/<component-name>/<component-name>.html`.
This helps keep complexity low, and makes it easy to separate parts of your application into smaller and more maintainable parts. The view folder is configurable, and it is even possible to provide your own factory function for complete customizability.
Generates a directive in `app/scripts/components` that uses a factory called `componentFactory` for convention over configuration.

Example:
```bash
yo angular-cmelion:component awesomeUnicorn
```
Produces these files:
`app/scripts/components/awesome-unicorn.js`:
```javascript
angular.module('yourModule.components')
    .controller('awesomeUnicornCtrl', function ($scope, $element) {
        $element.text('this is the awesome unicorn component');
    })
    .component('awesomeUnicorn', function () {
        return {
            controller: 'awesomeUnicornComponentCtrl'
        };
    });
```
`test/spec/components/awesome-unicorn.js`
`app/styles/components/awesome-unicorn/_awesome-unicorn.scss` (and adds an import statement to it in `app/styles/_components.scss`)
`app/views/components/awesome-unicorn/awesome-unicorn.html`
```
<div class="awesome-unicorn-component">
    <p>This is the awesome-unicorn component.</p>
</div>
```

Witch in turn lets you specify custom HTML tags like this to invoke a completely self contained component:
```
<awesome-unicorn-component></awesome-unicorn-component>
```

The view has specified a component name as a class, helping you avoid CSS collisions. Specify your styles specific for this component in SCSS under a ```.awesome-unicorn-component``` class wrapper, and only this component is targeted. This is an OK approach until shadow DOMs and web components become widely supported.

### Filter
Generates a filter in `app/scripts/filters`.

Example:
```bash
yo angular-cmelion:filter myFilter
```

Produces `app/scripts/filters/my-filter.js`:
```javascript
angular.module('myMod').filter('myFilter', function () {
  return function (input) {
    return 'myFilter filter:' + input;
  };
});
```

### Service
Generates an AngularJS service.

Example:
```bash
yo angular-cmelion:service myService
```

Produces `app/scripts/services/my-service.js`:
```javascript
angular.module('myMod').service('myService', function () {
  // ...
});
```

You can also do `yo angular:factory`, `yo angular:provider`, `yo angular:value`, and `yo angular:constant` for other types of services.

### Repository
Generates an AngularJS factory that returns a class that has `$save` and `$delete` methods and more, and an accompanying repository to handle client side caching and change tracking.
It uses $http by default, but you should override the methods for your own implementation. Return promises, and you're good.

Example:
```bash
yo angular-cmelion:repository school
```

Produces `app/scripts/models/school.js`, `app/scripts/repositories/school.js` and an accompanying tests and mock data. Then you will be able to use this model in your application like this:

```javascript
angular.module('myMod').service('myService', function (SchoolRepository) {
  var school = SchoolRepository.create({id:5, title:'Awesomesauce'});
  school.$save();
});
```

### Decorator
Generates an AngularJS service decorator.

Example:
```bash
yo angular-cmelion:decorator serviceName
```

Produces `app/scripts/decorators/servicename-decorator.js`:
```javascript
angular.module('myMod').config(function ($provide) {
    $provide.decorator('serviceName', function ($delegate) {
      // ...
      return $delegate;
    });
  });
```

### CoffeeScript
CoffeScript is not supported for now for maintenance reasons. Coffescript is awesome, but I won't spend the time necessary to maintain different versions for now. May be added in the future.

### Minification Safe
The recommended build process uses `ngmin`, a tool that automatically adds these annotations. However, if you'd rather not use `ngmin`, you have to add these annotations manually yourself.

## Bower Components

The following packages are always installed by the [app](#app) generator:

* angular
* angular-mocks
* angular-animate
* angular-scenario
* angular-component-factory
* angular-ui-router
* angular-promise-tracker
* angular-loading-bar
* angular-xeditable
* angular-ui-bootstrap
* ng-symbiosis-utils
* ng-symbiosis-routeprovider
* ng-symbiosis-repository
* ng-symbiosis-model

The following additional modules are optional:

* angular-cookies
* angular-loader
* angular-touch
* angular-resource
* angular-sanitize
* ngStorage

All of these can be updated with `bower update` as new versions of AngularJS are released.
When you install new dependancies you have to add a reference to the script files in `resources.json` under ```external```. The build task will inject this into `index.html` during runtime, and when you build the project it will by convention use the minified version of the source file, that should be located in the same folder, with the exact same filename with a `.min` suffix. This will be concatenated without minification.

## Configuration
Yeoman generated projects can be further tweaked according to your needs by modifying project files appropriately.

### Output
You can change the `app` directory by adding a `appPath` property to `bower.json`. For instance, if you wanted to easily integrate with Express.js, you could add the following:

```json
{
  "name": "yo-test",
  "version": "0.0.0",
  ...
  "appPath": "public"
}

```
This will cause Yeoman-generated client-side files to be placed in `public`.

## Resources.json
All configuration about what files and in what order the files are supposed to be loaded is specified in ```resources.json```.
This configuration is shared between both jasmine, minifiers and index.html.

Resource.json contains two sections. One for JS and one for SCSS.
```
"config/routes.js",
"scripts/**/*.js"
```
Files will be matched only once, so in the aforementioned example the routes config will be loaded before everything else is included.

Add a reference in resource to the **unminified** version of the library you want to use, as it will automatically use the library suffixed with `.min` during build time.

## manifest.appcache
When you build your application, the will automatically be created a cache manifest file in the dist folder.
The manifest file must be served with the MIME type text/cache-manifest.
Read more about the HTML5 Appcache specification [here](http://appcachefacts.info/)

## Testing

Running `grunt test` will run the unit tests with karma.
Under the folder ```test/coverage``` you will find your whole application structure mapped into matching HTML documents describing how tests cover your code. Use this to your advantage. Crush bugs before they are born.

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

When submitting a PR, make sure that the commit messages match the [AngularJS conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/).

When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.

When submitting a new feature, add tests that cover the feature.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)

[![Analytics](https://ga-beacon.appspot.com/UA-46835353-1/generator-angular-cmelion/README)](https://github.com/igrigorik/ga-beacon)
