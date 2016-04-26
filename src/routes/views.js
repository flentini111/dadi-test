'use strict';

function viewsRoutes (router, db, templates, logger) {
    router.get('/', (req, res, next) => {
        templates.index({popular: db.getPopular(4), mostReadReviews: db.getMostReadReviews(2)}, (err, out) => {
            res.send(out);
        });
    });

    router.get('/film/:id', (req, res, next) => {
        db.get(req.params.id).then((film) => {
            templates.film({film: film, reviews: db.getMostReadReviews(2, film)}, (err, out) => {
                res.send(out);
            });
        });
    });

    router.get('/films', (req, res, next) => {
        // let's show the latest 30 films
        templates.films({films: db.getPopular(30)}, (err, out) => {
            res.send(out);
        });
    });

    router.get('/review/:id', (req, res, next) => {
        templates.review({}, (err, out) => {
            res.send(out);
        });
    });

    router.get('/reviews', (req, res, next) => {
        templates.reviews({reviews: db.getMostReadReviews(30)}, (err, out) => {
            res.send(out);
        });
    });

    router.get('/profile', (req, res, next) => {
        templates.profile({}, (err, out) => {
            res.send(out);
        });
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
