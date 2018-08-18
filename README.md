# Location Middleware

This package includes a set of scripts that makes it easy to get the location URL of the current call to your NodeJS server.

## Install

```js
// Using NPM
npm i location-middleware

// Using Yarn
yarn add location-middleware
```

## Use

### Manual

```js
const { getLocation } = require('location-middleware');

const location = getLocation('https://username:password@www.example.com/my/path?foo=bar#baz');
```

### Express

```js
const express = require('express');
const { expressLocation } = require('location-middleware');

const app = express();

app.use(expressLocation);

app.all('/my-route', (req, res) => {
  // Use `req.location`
});
```

## Content

This package uses the default `url` NodeJS module. So all the properties you will get are the ones described here: [NodeJS URL](https://nodejs.org/api/url.html#url_class_url) + the query object listing all query params with their values.

In short, if using `https://username:password@www.example.com/my/path?foo=bar#baz`:

```js
{
      href: 'https://username:password@www.example.com:3000/my/path?foo=bar&foo=baz#baz',
      origin: 'https://www.example.com:3000',
      protocol: 'https:',
      host: 'www.example.com:3000',
      hostname: 'www.example.com',
      port: '3000',
      username: 'username',
      password: 'password',
      pathname: '/my/path',
      search: '?foo=bar',
      query: {
        foo: 'bar'
      },
      hash: '#baz'
}
```

## Query params

The query params can be given in multiple ways, here is how this package deals with it (it uses the same package than `express`: `qs`).

```js
// ?foo=bar
{
  foo: 'bar';
}
```

```js
// ?foo=bar&foo=baz
{
  foo: ['bar', 'baz'];
}
```

```js
// ?foo[]=bar&foo[]=baz
{
  foo: ['bar', 'baz'];
}
```

```js
// ?foo[0]=bar&foo[1]=baz
{
  foo: ['bar', 'baz'];
}
```

```js
// ?foo[value1]=bar&foo[value2]=baz
{
  foo: {
    value1: 'bar',
    value2: 'baz'
  }
}
```

For a full list of options, please refer to the [qs](https://www.npmjs.com/package/qs) package.
