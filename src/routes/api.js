'use strict';

function apiRoutes (router, db, logger) {
    router.get('/search', (req, res, next) => {
        if(req.query.s && req.query.s.length >= 3) {
            db.search(req.query.s).then((result) => {
                res.writeHead(200, {'Content-Type' : 'application/json'});
                res.end(JSON.stringify(result));
            });
        } else {
            res.status(204).end();
        }
    });

    router.get('/films/:id', (req, res, next) => {
        db.get(req.params.id).then((result) => {
            // TODO better response code handling
            const responseCode = result.Title ? 200 : 400;

            res.writeHead(responseCode, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify(result));
        }).catch((err) => {
            logger.err(err);

            res.status(500).end();
        });
    });

    router.get('/user/:username', (req, res, next) => {

    });

    router.route('/films')
    .get((req, res, next) => {
        // TODO perform a db selection of the latest N films
    })
    .post((req, res, next) => {

    });

    router.route('/reviews')
    .get((req, res, next) => {

    })
    .post((req, res, next) => {

    });

    return router;
}

module.exports = apiRoutes;
