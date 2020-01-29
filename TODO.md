# TODO List

## Connection failure not handled and we get an UnhandledPromiseRejection warning

## Logging

Can we use Loggly so I can monitor remotely?

## Docker build
1.  Resolve what should be where in package.json dependencies so we can use `npm ci --only production` properly to omit testing packages, etc. But we do need buid tools (angular-cli, ts, etc), types, etc.
Maybe we need to omit node_modules from copy to final image and run `npm ci --only production` there.

## Request objects/route params
1.  Trawl through and rationalize. Some route param Ids are required in requests, etc.