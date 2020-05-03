var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
/* --- V7: Using Dot Env ---
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '********',
  port: 5432,
})
*/
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = `CREATE or REPLACE procedure addManager (inputUsername text, inputPassword text)
AS $$

declare
    maxInt int;
    usernameCheck text;
begin

SELECT username into usernameCheck
FROM managerLogin
WHERE username = inputUsername;

if usernameCheck IS NOT NULL then
    raise exception 'This username is taken. Please choose another username!';
end if;

select coalesce(max(mid), 0) into maxInt from managerLogin;
insert into managerLogin (username, password, mid) values (inputUsername, inputPassword, maxInt+1);

end
$$ language plpgsql;

call addManager(`;

// GET
router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.error && sess.error != null && sess.errortype === 'usernamewrong') {
        console.log("error: username is wrong");
        res.render('managerNew', { title: 'Add new manager', error: sess.error});
        sess.error = null;
    }
    else {
        res.render('managerNew', { title: 'Add new manager', error: null });
    }
});

// POST
router.post('/', function (req, res, next) {
    // Retrieve Information
    var username = req.body.username;
    var password = req.body.password;

    // Construct Specific SQL Query
    var insert_query = sql_query + '\'' + username + '\', \'' + password + '\')';
    console.log(insert_query);

    pool.query(insert_query, (err, data) => {
        if (err) {
            console.log(err.stack);
            //alert(err.stack);
            sess = req.session;
            var errormessage = err.stack;
            sess.error = errormessage;
            sess.errortype = 'usernamewrong';
            res.redirect('/managerNew');
        }
        else {
            sess = req.session;
            sess.login = 1;
            sess.manager = 1;
            sess.error = null;
            var sql_query = 'SELECT mid FROM managerLogin WHERE Username = \'';
            insert_query = sql_query + username + '\'';
            var data23;
            pool.query(insert_query, (err, data2) => {
                var data3 = data2.rows;
                data23 = data3[0].mid;
                req.session.manager = data23;
                console.log("new manager created and logged in");
                console.log(req.session.manager);
                res.redirect('/');
            });
        }
    });
});

module.exports = router;
