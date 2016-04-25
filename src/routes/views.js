'use strict';

function viewsRoutes (router, db, templates, logger) {
    router.get('/', (req, res, next) => {
        templates.index({popular: db.getPopular(4), mostReadReviews: db.getMostReadReviews(2)}, (err, out) => {
            res.send(out);
        });
    });

    router.get('/film/:id', (req, res, next) => {
        const film = db.get(req.params.id);

        if(film) {
            templates.film({film: film, reviews: db.getMostReadReviews(2, film)}, (err, out) => {
                res.send(out);
            });
        }
    });

    router.get('/film/:id', (req, res, next) => {
        const film = db.get(req.params.id);

        if(film) {
            templates.film({film: film}, (err, out) => {
                res.send(out);
            });
        }
    });

    router.get('/film/:id', (req, res, next) => {
        const film = db.get(req.params.id);

        if(film) {
            templates.film({film: film}, (err, out) => {
                res.send(out);
            });
        }
    });

    router.get('*', (req, res, next) => {
        templates['404']({}, (err, out) => {
            res.status(404).send(out);
        });
    });

    function truncate(string, words) {
        return string.split(' ').slice(0, words).join(' ');
    }

    return router;
}

module.exports = viewsRoutes;
