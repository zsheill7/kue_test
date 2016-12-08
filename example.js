var kue = require('kue-scheduler');
var Queue = kue.createQueue();
var jobName = "sendReport";

// Create a job instance in the queue.
var job = Queue
            .createJob(jobName)
            // Priority can be 'low', 'normal', 'medium', 'high' and 'critical'
            .priority('normal')
            // We don't want to keep the job in memory after it's completed.
            .removeOnComplete(true);

// Schedule it to run every 60 minutes. Function every(interval, job) accepts interval in either a human-interval String format or a cron String format.
Queue.every('60 minutes', job);

// Processing a scheduled job.
Queue.process(jobName, sendReport);

// The body of job goes here.
function sendReport(job, done) { 
  Parse.Cloud.httpRequest({
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
  },
  url: "https://example.com/url/", // Webhook url
  body: "body goes here"}).then(function(httpResponse) {
    console.log("Successfully POSTed to the webhook");
    // Don't forget to run done() when job is done.
    done();
  }, function(httpResponse) {
    var errorMessage = "Couldn't POST to webhook: " + httpResponse;
    console.error(errorMessage);
    // Pass Error object to done() to mark this job as failed.
    done(new Error(errorMessage));
  });
}