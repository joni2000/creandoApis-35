const db = require('../../database/models');

const getUrl = (req) => `${req.protocol}://${req.get('host')}${req.originalUrl}`


module.exports = {
    getAll: (req, res) => {
        db.Movie.findAll({
            include: 
                [{association: 'genre'}, 
                {associate: 'actors'}]
        })
        .then(movies => {
            return res.status(200).json({
                meta: {
                    endpoint: getUrl(req),
                    status: 200,
                    total: movies.length
                },
                data: movies
            })
        })
        .catch(error => {
            res.status(400).send(error)
        })
    },
    getOne: (req, res) => {
        if(req.params.id % 1 !== 0 || req.params.id < 0) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    msg: 'Wrong ID'
                }
            })
        }else{
            db.movie.findOne({
                where: {
                    id: req.params.id,
                },
                include:
                    [{association: 'genre'}, 
                     {associate: 'actors'}]
            })
            .then(movie => {
                if(movie){
                    return res.status(200).json({
                        meta: {
                            endpoint: getUrl(req),
                            status: 200
                        },
                        data: movie
                    })
                }else{
                    return res.status(400).json({
                        meta: {
                            status: 400,
                            msg: 'ID not found'
                        }
                    })
                }
            })
            .catch(error => res.status(500))
        }
    },
    add: (req, res) => {
        const { title , rating, awards, release_date, length, genre_id } = req.body
        db.Movie.create({
            title,
            rating,
            awards,
            release_date,
            length,
            genre_id
        })
        .then(movie => {
            res.status(201).json({
                meta: {
                    endpoint: `${req.protocol}://${req.get('host')}/movies/${movie.id}`,
                    msg: 'Movie added successfully'
                }
            })
        })
        .catch(error => {
            switch (error.name) {
                case 'sequelizeValidationError':
                    let errorsMsg = [];
                    let notNullErrors = [];
                    let validationsErrors = [];
                    error.errors.forEach(error => {
                        errorsMsg.push(error.message);
                        if(error.type == 'Validation error'){
                            validationsErrors.push(error.message)
                        }
                        if(error.type == 'notNull Violation'){
                            notNullErrors.push(error.message)
                        }
                    })
                    let response = {
                        status: 400,
                        message: 'missing or wrong data',
                        errors: {
                            quantity: errorsMsg.length,
                            msg: errorsMsg,
                            notNull: notNullErrors,
                            validations: validationsErrors
                        }
                    }
                    return res.status(400).json(response);
                    default: 
                        return res.status(500)
            };
        })
    },
    update: (req, res) => {
        const { title , rating, awards, release_date, length, genre_id } = req.body
        db.Movie.update({
            title,
            rating,
            awards,
            release_date,
            length,
            genre_id
        },
        {
            where: {
                id: req.params.id
            }
        })
        .then(result => {
            if(result){
                return res.status(201).json({
                    msg: 'Movie update seccessfully'
                })
            }else{
                return res.status(200).json({
                    msg: 'no changes'
                })
            }
        })
    },
    delete: (req, res) => {
        let actorUpdate = 
Promise.all([actorUpdate, actorMovieUpdate]).then(
            db.Movie.destroy({
                where: {
                    id: req.params.id,
                },
            })
            .then(result => {
                if(result){
                    return res.status(200).json({
                        msg: 'Movie deleted successfully',
                    })
                }else{
                    return res.status(200).json({
                        msg: 'no changes',
                    });
                }
            })
            .catch((error) => res.status(500).send(error))
        )
    },
}
