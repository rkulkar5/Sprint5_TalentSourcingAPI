let express = require('express'),
   path = require('path'),
   mongoose = require('mongoose'),
   cors = require('cors'),
   bodyParser = require('body-parser'),
   dbConfig = require('./database/db');

// Connecting with mongo db
mongoose.Promise = global.Promise;

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, dbConfig.options).then(() => {
      console.log('Database sucessfully connected')
   },
   error => {
      console.log('Database could not connected: ' + error)
   }
)

// Setting up port with express js
const candidateRoute = require('./routes/candidate.route');
const bandRoute = require('./routes/band.route');
const jrssRoute = require('./routes/jrss.route');
const testConfigRoute = require('./routes/testConfig.route');
const quizQuestionsRoute = require('./routes/questionBank.route');
const userAnswerRoute = require('./routes/userAnswer.route');
const loginRoute = require('./routes/login.route');
const resultRoute = require('./routes/userResult.route');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));

var whitelist = ['http://localhost:4200','https://tatclientapp.mybluemix.net']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Untrusted source of access!!!'))
    }
  }
}

app.use(function(req,res, next){
   if(req.method == "OPTIONS"){
      res.header('Access-Control-Allow-Headers', "*");
      res.header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, PUT, PATCH, DELETE");
      res.header('Access-Control-Allow-Origin', "*");
      res.header('Access-Control-Allow-Credentials', true);
      return res.sendStatus(200);
    }
    else
      return next();
});
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'dist/mean-stack-crud-app')));
app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')));
app.use('/api', candidateRoute)
app.use('/api/band', bandRoute);
app.use('/api/testConfig', testConfigRoute);
app.use('/api/jrss', jrssRoute);
app.use('/api/quiz', quizQuestionsRoute)
app.use('/api/userAnswer', userAnswerRoute)
app.use('/api/login', loginRoute)
app.use('/result', resultRoute)


// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
   next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});
