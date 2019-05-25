
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTeachers(res, mysql, context, complete){
        mysql.pool.query("SELECT classid, fname, lname FROM Class", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.class = results;
            complete();
        });
    }

    function getStudents(res, mysql, context, complete){
        mysql.pool.query("SELECT studid, sfname, slname, classroomid, tfundraised, Class.fname, Class.lname FROM Student LEFT JOIN Class ON Student.classroomid = Class.classid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Student  = results;
            complete();
        });
    }

    function getPeopleWithNameLike(req, res, mysql, context, complete) {
      var query = "SELECT studid, sfname, slname, classroomid, tfundraised, Class.fname, Class.lname FROM Student LEFT JOIN Class ON Student.classroomid = Class.classid WHERE Student.slname LIKE " + mysql.pool.escape(req.params.s + '%');
	console.log(query)
	mysql.pool.query(query, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.Student = results;
		complete();
	});
    }

    function getStudent(res, mysql, context, id, complete) {
    	var sql = "SELECT studid, sfname, slname, classroomid, tfundraised FROM Student WHERE Student.studid = ?";
    	var inserts = [id];
    	mysql.pool.query(sql, inserts, function (error, results, fields) {
    		if (error) {
    			res.write(JSON.stringify(error));
    			res.end();
    		}
    		context.student = results[0];
    		complete();
    	});
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = { title: 'students', active: { students: true } };
        var mysql = req.app.get('mysql');
        getTeachers(res, mysql, context, complete);
	getStudents(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('students', context);
            }

        }
    });

    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = { title: 'students', active: { students: true } };
        var mysql = req.app.get('mysql');
        getPeopleWithNameLike(req, res, mysql, context, complete);
	getTeachers(req, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('students', context);
            }
        }
    });

    router.get('/:id', function (req, res) {
    	callbackCount = 0;
    	var context = { title: 'update-students', active: { students: true } };
    	var mysql = req.app.get('mysql');
    	getStudent(res, mysql, context, req.params.id, complete);
    	getTeachers(res, mysql, context, complete);
    	function complete() {
    		callbackCount++;
    		if (callbackCount >= 2) {
    			res.render('update-students', context);
    		}

    	}
    });

    router.post('/:id', function (req, res) {
    	console.log(req.body)
    	console.log(req.params.id)
    	var mysql = req.app.get('mysql');
    	var sql = "UPDATE Student SET sfname=?, slname=?, tfundraised=?, classroomid=? WHERE Student.studid=?";
    	var inserts = [req.body.sfname, req.body.slname, req.body.tfundraised, req.body.classroomid, req.params.id];
    	sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    		if (error) {
    			console.log(error)
    			res.write(JSON.stringify(error));
    			res.end();
    		} else {
    			res.status(200);
    			res.end();
    		}
    	});
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Student (sfname, slname, classroomid) VALUES (?,?,?)";
        var inserts = [req.body.sfname, req.body.slname, req.body.classroomid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('students');
            }
        });
    });

    return router;
}();
