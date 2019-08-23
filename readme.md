# Url Shortener API

A backend for a url shortener application.

Based on [Build a Custom URL Shortener Service](https://youtu.be/Z57566JBaZQ) by
Traversy Media.

## Stack

This application will be built with NodeJS/Express/MongoDB.

## Third Party Libraries/Tools Used

- ExpressJS: server framework
- Mongoose: MongoDB Object modeling
- ShortID: Hash IDs to short url
- Config: Handle app configuration values
- Valid Url: URI validation

## Testing

This application uses the Jest test framework and `mongo-db-memory-server` as a
fixture for the database in the tests.

Run tests with he command `npm test`. Tests may be run in watch mode with
`jest --watch`.
