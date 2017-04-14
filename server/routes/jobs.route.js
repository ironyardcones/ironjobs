const jobsRouter = require('express').Router();
const Job = require('../models/Job.model.js');


/**
* getAJob finds a particular job in the database and assigns it to the response provided by the api
* @type {Boolean}
*/
jobsRouter.get('/:id', function getAJob(req, res, next) {
  Job.findByID(req.params.id)
  .then(function sendBackTheJob(job) {
    if (!job) {
      let err = new Error('job not found');
      err.status = 404;
      return next(err);
    }
    res.json(job);
  })
  .catch(function handleIssues(err) {
    console.error(err);
    let ourError = new Error('There was an error finding the job matching id: ', req.params.id);
    ourError.status = err.status;
    return next(ourError);
  });
});

/**
 * getAllJobs creates a response object that contains a JSON array of each job object containing company name, link, and notes.
 * @param  {Object}   req  the request object received from the frontend
 * @param  {Object}   res  the response object to return to the frontend
 * @param  {Function} next the middleware to proceed to next, if called
 * @return {Void}
 */
jobsRouter.get('/', function getAllJobs(req, res, next) {
  if (Object.keys(req.query).length) {
    // console.log("*****************", req.query.query);
    Job.find({
      company: {$regex: req.query.query, $options: 'i'}
    })
    .then(function sendBackMatchingJobs(data) {
      console.log('hitting path?', req.query.query);
      res.json(data);
    })
    .catch(function handleIssues(err) {
      console.error(err);
      let ourError = new Error('Error finding the job matching: ', req.query.query);
      ourError.status = 422;
      return next(ourError);
    });
  }
  else {
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
    .catch(function handleIssues(err) {
      console.error(err);
      let ourError = new Error('Unable to retieve jobs');
      ourError.status = 500;
      return next(ourError);
    });
  }
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

  let theJobCreated = new Job({company: req.body.company, link: req.body.link, notes: req.body.notes, createTime: new Date()});

  theJobCreated.save()
  .then(function sendBackTheResponse(data) {
    console.log('data of new job added', data);
    res.json(data);
  })
  .catch(function handleIssues(err) {
    console.error(err);
    let ourError = new Error('unable to save job');
    ourError.status = 422;
    next(ourError);
  });
}

jobsRouter.post('/', addAJob);

module.exports = jobsRouter;
