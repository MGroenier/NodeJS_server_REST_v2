// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var multer      = require('multer');
var Capture     = require('./models/capture');

mongoose.connect('mongodb://capnow:qw789@ds119368.mlab.com:19368/cap_now');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var upload = multer({ dest: './uploads/'});

var port = process.env.PORT || 8081;        // set our port

app.get('/', function(req,res){
    res.sendfile('index.html');
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(upload.single('capture-file'));

router.use(function(req, res, next) {
    console.log('an API-request was done.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /captures
// ----------------------------------------------------
router.route('/captures')

    // create a capture (accessed at POST http://localhost:8081/api/captures)
    .post(function(req, res) {
        
        var capture = new Capture();      // create a new instance of the Capture model
        capture.title = req.body.title;  // set the captures name (comes from the request)
        capture.file_location = req.file.destination;
        capture.file_name = req.file.filename;
        
        capture.file_format = '.' + req.file.originalname.split('.').pop();
        
        console.log(req.body);
        console.log(req.body.title);
        console.log(req.file);
        
        // save the capture and check for errors
        capture.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Capture created!' });
        });
        
    })
    
    // get all the captures (accessed at GET http://localhost:8081/api/captures)
    .get(function(req, res) {
        Capture.find(function(err, captures) {
            if (err)
                res.send(err);

            res.json(captures);
        });
    });
    
    
// on routes that end in /captures/:capture_id
// ----------------------------------------------------
router.route('/captures/:capture_id')

    // get the capture with that id (accessed at GET http://localhost:8081/api/captures/:capture_id)
    .get(function(req, res) {
        Capture.findById(req.params.capture_id, function(err, capture) {
            if (err)
                res.send(err);
            res.json(capture);
        });
    })
    
    // update the capture with this id (accessed at PUT http://localhost:8081/api/captures/:capture_id)
    .put(function(req, res) {

        // use our capture model to find the capture we want
        Capture.findById(req.params.capture_id, function(err, capture) {

            if (err)
                res.send(err);

            capture.name = req.body.name;  // update the captures info

            // save the capture
            capture.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Capture updated!' });
            });

        });
    })
    
    // delete the capture with this id (accessed at DELETE http://localhost:8080/api/captures/:capture_id)
    .delete(function(req, res) {
        Capture.remove({
            _id: req.params.capture_id
        }, function(err, capture) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);