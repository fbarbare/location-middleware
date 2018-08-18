import { getLocation, expressLocation } from './index';

describe('getLocation', () => {
  it('returns the url parsed', () => {
    const location = getLocation(
      'https://username:password@www.example.com:3000/my/path?foo=bar#baz'
    );

    expect(location).toEqual({
      href: 'https://username:password@www.example.com:3000/my/path?foo=bar#baz',
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
    });
  });

  describe('Query params', () => {
    it('returns the query params as an object', () => {
      const location = getLocation('http://www.example.com?param1=value1&param2=value2');

      expect(location.query).toEqual({
        param1: 'value1',
        param2: 'value2'
      });
    });

    it("returns the query param's as an array if there are multiple times the same key", () => {
      const location = getLocation('http://www.example.com?param=value1&param=value2');

      expect(location.query).toEqual({
        param: ['value1', 'value2']
      });
    });

    it("returns the query param's as an array if the key is as an array", () => {
      const location = getLocation('http://www.example.com?param[]=value1&param[]=value2');

      expect(location.query).toEqual({
        param: ['value1', 'value2']
      });
    });

    it("returns the query param's as an array if the key is as an array with numbers inside", () => {
      const location = getLocation('http://www.example.com?param[0]=value1&param[1]=value2');

      expect(location.query).toEqual({
        param: ['value1', 'value2']
      });
    });

    it("returns the query param's as an object if the key is as an array with letters inside", () => {
      const location = getLocation(
        'http://www.example.com?param[myValue1]=value1&param[myValue2]=value2'
      );

      expect(location.query).toEqual({
        param: {
          myValue1: 'value1',
          myValue2: 'value2'
        }
      });
    });
  });
});

describe('expressLocation', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: { host: 'username:password@www.example.com:3000' },
      connection: { encrypted: false },
      originalUrl: '/my/path?foo[0]=bar&foo[1]=baz#baz'
    };
    res = null;
    next = jest.fn();
  });

  it('returns the url parsed', () => {
    expressLocation(req, res, next);

    expect(req.location).toEqual({
      href: 'http://username:password@www.example.com:3000/my/path?foo[0]=bar&foo[1]=baz#baz',
      origin: 'http://www.example.com:3000',
      protocol: 'http:',
      host: 'www.example.com:3000',
      hostname: 'www.example.com',
      port: '3000',
      username: 'username',
      password: 'password',
      pathname: '/my/path',
      search: '?foo[0]=bar&foo[1]=baz',
      query: {
        foo: ['bar', 'baz']
      },
      hash: '#baz'
    });
  });

  describe('HTTPS', () => {
    it('detects https from the encrypted property', () => {
      req.connection.encrypted = true;

      expressLocation(req, res, next);

      expect(req.location).toEqual(
        expect.objectContaining({
          href: 'https://username:password@www.example.com:3000/my/path?foo[0]=bar&foo[1]=baz#baz',
          origin: 'https://www.example.com:3000',
          protocol: 'https:'
        })
      );
    });

    it('detects https when coming from a proxy', () => {
      req.headers['x-forwarded-proto'] = 'https';

      expressLocation(req, res, next);

      expect(req.location).toEqual(
        expect.objectContaining({
          href: 'https://username:password@www.example.com:3000/my/path?foo[0]=bar&foo[1]=baz#baz',
          origin: 'https://www.example.com:3000',
          protocol: 'https:'
        })
      );
    });
  });
});
