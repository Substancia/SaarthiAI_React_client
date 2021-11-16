/*
Server file to serve production build of FE React App.
*/

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 8080;

const App = express();
App.use(express.static(path.join(__dirname, 'build')));

App.get('/ping', (req, res) => res.send('pong'));

App.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

App.listen(PORT, () => console.log('FE React App running at', PORT));