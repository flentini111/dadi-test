'use strict';

const moment = require('moment');

function viewsRoutes (router, db, templates, logger) {
    router.get('/', (req, res, next) => {
        templates.index({popular: db.getPopular(4), mostReadReviews: db.getMostReadReviews(2)}, (err, out) => {
            if (err) {
                logger.error(err);
                res.status(500).end();
            }

            res.send(out);
        });
    });

    router.get('/film/:id', (req, res, next) => {
        db.get(req.params.id).then((film) => {
            const reviews = db.getMostReadReviews(2, film).map((review) => {
                if (!review.excerpt) {
                    review.excerpt = truncate(review.content, 45);
                }

                review.date = moment(review.meta.created).format('D MMMM YYYY');

                return review;
            });

            templates.film({film: film, reviews: reviews}, (err, out) => {
                if (err) {
                    logger.error(err);
                    res.status(500).end();
                }

                res.send(out);
            });
        });
    });

    router.get('/films', (req, res, next) => {
        // let's show the latest 30 films
        templates.films({films: db.getPopular(30)}, (err, out) => {
            if (err) {
                logger.error(err);
                res.status(500).end();
            }

            res.send(out);
        });
    });

    router.get('/review/:id', (req, res, next) => {
        templates.review({review: db.getReview(req.params.id)}, (err, out) => {
            if (err) {
                logger.error(err);
                res.status(500).end();
            }

            res.send(out);
        });
    });

    router.get('/reviews', (req, res, next) => {
        const reviews = db.getMostReadReviews(30).reduce((r, review) => {
            // each element is a container of reviews, one per film
            const reviewContainer = r.filter((container) => {
                return container.filmId === review.filmId;
            })[0];

            if(reviewContainer) {
                reviewContainer.reviews.push(review);
            } else {
                r.push({
                    filmId: review.filmId,
                    poster: review.poster,
                    reviews: [review]
                });
            }

            return r;
        }, []);

        templates.reviews({reviews: reviews}, (err, out) => {
            if (err) {
                logger.error(err);
                res.status(500).end();
            }

            res.send(out);
        });
    });

    router.get('/profile', (req, res, next) => {
        templates.profile({}, (err, out) => {
            if (err) {
                logger.error(err);
                res.status(500).end();
            }

            res.send(out);
        });
    });

    router.get('*', (req, res, next) => {
        templates['404']({}, (err, out) => {
            res.status(404).send(out);
        });
    });

    /**
     * utility function to generate an excerpt for reviews without it.
     *
     * @private
     * @param {string} string the content to cut
     * @param {number} words the number of words needed
     * @return {string}
     */
    function truncate(string, words) {
        return string.split(' ').slice(0, words).join(' ');
    }

    return router;
}

module.exports = viewsRoutes;
