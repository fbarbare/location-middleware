const { URL } = require('url');
const { parse } = require('qs');

function defineProperty(object, property, value) {
  Object.defineProperty(object, property, {
    value,
    writable: false,
    enumerable: true,
    configurable: false
  });
}

function getLocation(url) {
  const location = {};
  const urlParsed = new URL(url);

  [
    'href',
    'origin',
    'protocol',
    'username',
    'password',
    'host',
    'hostname',
    'port',
    'pathname',
    'search',
    'hash'
  ].forEach(key => {
    defineProperty(location, key, urlParsed[key]);
  });

  const searchContent = urlParsed.search.split('?')[1];
  if (searchContent) {
    defineProperty(location, 'query', parse(searchContent));
  } else {
    defineProperty(location, 'query', {});
  }

  return location;
}

function expressLocation(req, res, next) {
  const isHttps =
    req.headers['x-forwarded-proto'] === 'https' || !!(req.connection || {}).encrypted;
  const protocol = isHttps ? 'https:' : 'http:';
  const location = getLocation(`${protocol}//${req.headers.host}${req.originalUrl}`);

  defineProperty(req, 'location', location);

  next();
}

function koaLocation() {
  return function(ctx, next) {
    const isHttps = ctx.headers['x-forwarded-proto'] === 'https' || request.secure;
    const protocol = isHttps ? 'https:' : 'http:';
    const location = getLocation(`${protocol}//${ctx.headers.host}${ctx.originalUrl}`);

    defineProperty(req, 'location', location);

    next();
  };
}

exports.expressLocation = expressLocation;
exports.koaLocation = koaLocation;
exports.getLocation = getLocation;
