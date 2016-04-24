'use strict';

function viewsRoutes (router, db, templates) {
    router.get('/', (req, res, next) => {
        templates.index({}, (err, out) => {
            res.send(out);
        });
    });

    return router;
}

module.exports = viewsRoutes;
