'use strict';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost/bookmark';
//const ELEPHANT_URL = 'postgres://dadfkrcu:Fe_sqQGhLzoOifpDLXC99aDHEZdyLSlC@stampy.db.elephantsql.com:5432/dadfkrcu';

const knex = require('knex')({
  client: 'pg',
  connection: DATABASE_URL,              //process.env.DATABASE_URL,
  debug: true // http://knexjs.org/#Installation-debug
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const { validatePatchRequest, validatePostRequest, descriptionToDesc } = require('./validation-functions');


app.use(express.json());
app.use(express.static('./public'));




app.get('/bookmarks', (req, res, next) => {
  knex('bookmarks')
    .select()
    .then(dbRes => {
      dbRes.forEach(bookmark => descriptionToDesc(bookmark) );
      res.json(dbRes);
    })
    .catch(err => next(err));
});




app.post('/bookmarks', (req, res, next) => {
  const validateErr = validatePostRequest(req.body);
  if(validateErr){
    return next(validateErr);
  }

  const {title, rating, url, desc} = req.body;

  knex('bookmarks')
    .insert({
      'title': title,
      'rating': rating,
      'url': url,
      'description': desc
    })
    .returning(['id', 'title', 'rating', 'url', 'description'])
    .then( ([dbRes]) => {
      descriptionToDesc(dbRes);
      res.json(dbRes);
    })
    .catch(err => next(err));
});





app.patch('/bookmarks/:id', (req, res, next) => {
  const validateErr = validatePatchRequest(req.body);
  if(validateErr){
    return next(validateErr);
  }

  const id = req.params.id;
  const update = req.body;

  knex('bookmarks')
    .where({'id':id})
    .update(update)
    .returning(['id', 'title', 'description', 'url', 'rating'])
    .then( ([dbRes]) => {
      if(dbRes){
        descriptionToDesc(dbRes);
        res.json(dbRes);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});





app.delete('/bookmarks/:id', (req, res, next) => {
  const id = req.params.id;

  knex('bookmarks')
    .del()
    .where({'id': id})
    .then(dbRes => {
      if(dbRes){
        res.status(204).json(dbRes);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});




app.use('/', (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use('/', (err, req, res, next) => {
  if(err.status){
    res.status(err.status).json({'status': err.status, 'message': err.message});
  } else {
    res.sendStatus(500);
  }
});



app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});