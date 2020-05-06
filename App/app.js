var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

/* --- V7: Using dotenv     --- */
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/* --- V2: Adding Web Pages --- */
var aboutRouter = require('./routes/about');
/* ---------------------------- */

/* --- V3: Basic Template   --- */
var tableRouter = require('./routes/table');
var loopsRouter = require('./routes/loops');
/* ---------------------------- */

/* --- V4: Database Connect --- */
var selectRouter = require('./routes/select');
/* ---------------------------- */

/* --- V5: Adding Forms     --- */
var formsRouter = require('./routes/forms');
/* ---------------------------- */

/* --- V6: Modify Database  --- */
var insertRouter = require('./routes/insert');
var insert_restaurantsRouter = require('./routes/insert_restaurants');
/* ---------------------------- */

var customerRouter = require('./routes/customer');
var customerNewRouter = require('./routes/customerNew');
var customerProfileRouter = require('./routes/customerProfile');
var orderFoodRouter = require('./routes/orderFood');
var checkoutRouter = require('./routes/checkout');
var reviewRouter = require('./routes/reviews');
var customerEditPasswordRouter = require('./routes/customerEditPassword');
var foodListRouter = require('./routes/foodList');
var reviewFoodListRouter = require('./routes/reviewFoodList');
var rateFoodListRouter = require('./routes/rateFoodList');

var riderRouter = require('./routes/rider');
var riderNewRouter = require('./routes/riderNew');
var riderProfileRouter = require('./routes/riderProfile');
var riderPastDeliveriesRouter = require('./routes/riderPastDeliveries');
var riderEditPasswordRouter = require('./routes/riderEditPassword');

var staffRouter = require('./routes/staff');
var staffNewRouter = require('./routes/staffNew');

var managerRouter = require('./routes/manager');
var managerNewRouter = require('./routes/managerNew');
var managerProfileRouter = require('./routes/managerProfile');
var managerViewOrderRouter = require('./routes/allOrders');
var managerOrderStatsRouter = require('./routes/orderStatistics');
var managerOrderStatsResultRouter = require('./routes/orderStatisticsResult');
var managerViewRiderRouter = require('./routes/allRiders');
var managerRiderStatsRouter = require('./routes/riderInfo');
var managerDeliveryStatsRouter = require('./routes/deliveryStatistics');

var addFoodRouter = require('./routes/addFood');
var addPromotionRouter = require('./routes/addPromotion');


var restaurantProfileRouter = require('./routes/restaurantProfile');
var monthlySummaryRouter = require('./routes/monthlySummary');
var printMonthlySummaryRouter = require('./routes/printMonthlySummary');
var printPromotionSummaryRouter = require('./routes/printPromotionSummary');


var app = express();

// session
app.use(session({

  secret: 'abc',
  resave: false,
  saveUninitialized: true
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* --- V2: Adding Web Pages --- */
app.use('/about', aboutRouter);
/* ---------------------------- */

/* --- V3: Basic Template   --- */
app.use('/table', tableRouter);
app.use('/loops', loopsRouter);
/* ---------------------------- */

/* --- V4: Database Connect --- */
app.use('/select', selectRouter);
/* ---------------------------- */

/* --- V5: Adding Forms     --- */
app.use('/forms', formsRouter);
/* ---------------------------- */

/* --- V6: Modify Database  --- */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/insert', insertRouter);
app.use('/insert_restaurants', insert_restaurantsRouter);
/* ---------------------------- */

app.use('/customer', customerRouter);
app.use('/customerNew', customerNewRouter);
app.use('/customerProfile', customerProfileRouter);
app.use('/orderFood', orderFoodRouter);
app.use('/checkout',checkoutRouter);
app.use('/reviews',reviewRouter);
app.use('/customerEditPassword',customerEditPasswordRouter);
app.use('/foodList', foodListRouter);
app.use('/reviewFoodList', reviewFoodListRouter);
app.use('/rateFoodList', rateFoodListRouter);

app.use('/rider', riderRouter);
app.use('/riderNew', riderNewRouter);
app.use('/riderProfile', riderProfileRouter);
app.use('/riderPastDeliveries', riderPastDeliveriesRouter);
app.use('/riderEditPassword', riderEditPasswordRouter);

app.use('/staff', staffRouter);
app.use('/staffNew', staffNewRouter);
app.use('/restaurantProfile', restaurantProfileRouter);
app.use('/addFood', addFoodRouter);
app.use('/addPromotion', addPromotionRouter);
app.use('/monthlySummary', monthlySummaryRouter);
app.use('/printMonthlySummary', printMonthlySummaryRouter);
app.use('/printPromotionSummary', printPromotionSummaryRouter);

app.use('/manager', managerRouter);
app.use('/managerNew', managerNewRouter);
app.use('/managerProfile', managerProfileRouter);
app.use('/allOrders', managerViewOrderRouter);
app.use('/orderStatistics', managerOrderStatsRouter);
app.use('/orderStatisticsResult', managerOrderStatsResultRouter);
app.use('/allRiders', managerViewRiderRouter);
app.use('/riderInfo', managerRiderStatsRouter);
app.use('/deliveryStatistics', managerDeliveryStatsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


