# DADI+ SEEN

### Installation

To install all the dependencies seen-server:

    cd /path/to/server
    npm install

#### Run the server

To run seen-server:

    cd /path/to/server
    npm start

What it does:

0.  Builds all the dust templates in the `templates` folder into the destination `views` folder
1.  Runs the server, listening to the port specified in the config

You can now point your browser to **http://localhost:9999**

Improvements:

*   Linting the source files as an automated task
*   Concat and minify all the js files

#### Run the tests

To run the server tests:

    cd /path/to/server
    npm test

Improvements:

*   add front end tests using PhantomJS/Selenium

#### Server structure

All the code is located in the src folder, with `server.js` as the application entry point located in the root folder. The db is mocked by loading `data/dataset.json` file that contains film information and reviews.

The logger is configured to write both to console and to file and providing a simple event store.

If the film is not present in the local datastore, a call to the OMDB Api is made through the `src/omdb` interface, which response is cached in memory. This also allows the search to work.

###### What doesn't work:
* the dropdown filter next to the titles, in the home
* the user profile
