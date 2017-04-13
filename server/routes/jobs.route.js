const jobsRouter = require('express').Router();
const Job = require('../models/Job.model.js');

jobsRouter.get('/find', function findMatchingJobs(req, res, next) {
  Job.find({
    company: {$regex: req.query.search, $options: 'i'}
  })
  .then(function sendBackMatchingJobs(data) {
    res.json(data);
  })
  .catch(function handleIssues(err) {
    let err = new Error('Jobs is not an array');
    err.status = 500;
    return next(err);
  });
});



/**
* getAJob finds a particular job in the database and assigns it to the response provided by the api
* @type {Boolean}
*/
jobsRouter.get('/:id', function getAJob(req, res, next) {
  Job.findByID(req.params.id);

/////////////////////////


  let thisID = req.params.id;
  let theJob = {};
  let err = new Error('Could not find matching job');
  err.status = 404;
  allJobs.forEach(function (job) {
    if (job.id === thisID) {
      theJob = job;
    } else {
      return next(err);
    }
  });
  res.send('You found a job with the id: ' + thisID + theJob);
  res.json(theJob);
});

/**
* getAllJobs creates a response object that contains a JSON array of each job object containing company name, link, and notes.
* @type {Array} ???
*/
jobsRouter.get('/', function getAllJobs(req, res, next) {
  Job.find()
  .then(function sendBackAllTheJobs(allJobs) {
    if (!Array.isArray(allJobs)) {
      let err = new Error('Jobs is not an array');
      err.status = 500;
      return next(err);
    }
    res.json(allJobs.map(function(job) {
      return {id: job.id, company: job.company, link: job.link};
    }));
  })
  .catch(function handleIssues() {
    let ourError = new Error('Unable to retieve jobs');
    ourError.status = 500;
    return next(ourError);
  });
});

/** Adds a job to the database
* @param {Object} req    Must have a body like: {'company': String, 'link': String} may include notes
* @param {Object} res    Contains various information including status code, json representation of the body
* @param {Function} next
* @return {void}
*/
function addAJob(req, res, next) {
  console.log('incoming data for POST', req.body);

  if(!req.body.company || !req.body.link) {
    let err = new Error('You must provide a link and company');
    err.status = 400;
    return next(err);
  }

  let theJobCreated = new Job({company: req.body.company, link: req.body.link, notes: req.body.notes, createTime: Date.now()});

  theJobCreated.save()
  .then(function sendBackTheResponse(data) {
    console.log('data of new job added', data);
    res.json(data);
  })
  .catch(function handleIssues(err) {
    let ourError = new Error('unable to save job');
    ourError.status = 422;
    next(ourError);
  });
}

jobsRouter.post('/', addAJob);

module.exports = jobsRouter;
