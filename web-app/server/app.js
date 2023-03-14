var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var addEmergencyContact = require('./routes/addEmergencyContact');
var assignDoctor = require('./routes/assignDoctor');
var createAppointment = require('./routes/createAppointment');
var deleteAsset = require('./routes/deleteAsset');
var fetchFileFromDatabase = require('./routes/fetchFileFromDatabase');
var fetchUsersFromDatabase = require('./routes/fetchUsersFromDatabase');
var generateBill = require('./routes/generateBill');
var generateEHR = require('./routes/generateEHR');
var generateLabRecord = require('./routes/generateLabRecord');
var generateMedicineReceipt = require('./routes/generateMedicineReceipt');
var grantAccess = require('./routes/grantAccess');
var grantDirectAccess = require('./routes/grantDirectAccess');
var logOut = require('./routes/logOut');
var readAsset = require('./routes/readAsset');
var readIndividualAsset = require('./routes/readIndividualAsset');
var readPatientDocuments = require('./routes/readPatientDocuments');
var registerDoctor = require('./routes/registerDoctor');
var registerHospital = require('./routes/registerHospital');
var registerInsurer = require('./routes/registerInsurer');
var registerLaboratory = require('./routes/registerLaboratory');
var registerPatient = require('./routes/registerPatient');
var registerPharmacy = require('./routes/registerPharmacy');
var registerResearcher = require('./routes/registerResearcher');
var removeEmergencyContact = require('./routes/removeEmergencyContact');
var requestAccess = require('./routes/requestAccess');
var revokeAccess = require('./routes/revokeAccess');
var updateAsset = require('./routes/updateAsset');
var verifyPassword = require('./routes/verifyPassword');
var getGenericData = require('./routes/getGenericData');
var emergencyaccess = require('./routes/emergencyAccess');

var app = express();
const cors = require('cors');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/addEmergencyContact', addEmergencyContact);
app.use('/assignDoctor', assignDoctor);
app.use('/createAppointment', createAppointment);
app.use('/deleteAsset', deleteAsset);
app.use('/fetchFileFromDatabase', fetchFileFromDatabase);
app.use('/fetchUsersFromDatabase', fetchUsersFromDatabase);
app.use('/generateBill', generateBill);
app.use('/generateEHR', generateEHR);
app.use('/generateLabRecord', generateLabRecord);
app.use('/generateMedicineReceipt', generateMedicineReceipt);
app.use('/getGenericData', getGenericData);
app.use('/grantAccess', grantAccess);
app.use('/grantDirectAccess', grantDirectAccess);
app.use('/logOut', logOut);
app.use('/readAsset', readAsset);
app.use('/readIndividualAsset', readIndividualAsset);
app.use('/readPatientDocuments', readPatientDocuments);
app.use('/registerDoctor', registerDoctor);
app.use('/registerHospital', registerHospital);
app.use('/registerInsurer', registerInsurer);
app.use('/registerLaboratory', registerLaboratory);
app.use('/registerPatient', registerPatient);
app.use('/registerPharmacy', registerPharmacy);
app.use('/registerResearcher', registerResearcher);
app.use('/removeEmergencyContact', removeEmergencyContact);
app.use('/requestAccess', requestAccess);
app.use('/revokeAccess', revokeAccess);
app.use('/updateAsset', updateAsset);
app.use('/verifyPassword', verifyPassword);
app.use('/emergencyaccess',emergencyaccess);
app.use(express.static(__dirname+'/uploads'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
