const jobsRouter = require('express').Router();

let allJobs = [
  {
    'id': '53248395452310448',          // assigned by MongoDB
    'company': 'The Iron Yard',     // provided on creation by the front end (required)
    'link': 'link here',        // provided on creation by the front end (required, either a URL or email address)
    'notes': 'some notes',       // provided on creation by the front end (optional)
    'createTime': Date.now()     // Created by the back end (YOU)
  },

  {
    'id': '29435436523425',          // assigned by MongoDB
    'company': 'Jordan Kasper',     // provided on creation by the front end (required)
    'link': 'link goes here',        // provided on creation by the front end (required, either a URL or email address)
    'notes': 'some notes',       // provided on creation by the front end (optional)
    'createTime': Date.now()     // Created by the back end (YOU)
  }
];

/**
 * getAJob finds a particular job in the database and assigns it to the response provided by the api
 * @type {Boolean}
 */
jobsRouter.get('/:id', function getAJob(req, res, next) {
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

  if (!Array.isArray(jobs)) {
    let err = new Error('Jobs is not an array');
    err.status = 500;
    return next(err);
  }

  allJobs.forEach(function (job) {
    console.log(job.company, job.link, job.notes); //supposed to be id, company, and link?
  });

    let jobsInfo = [];
    allJobs.forEach(function (job) {  //supposed to be id, company, and link?
      jobsInfo.push({
        company: job.company,
        link: job.link,
        notes: job.notes
      });
    });

    res.json(jobsInfo);
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

  // req.body.createTime = Date.now();
  // req.body.id = JSON.stringify(Date.now());
  
  allJobs.push(req.body);

  res.json({ message: 'I am adding a job!', theJobWeAdded: req.body });
}


jobsRouter.post('/', addAJob);

module.exports = jobsRouter;
