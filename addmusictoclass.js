
module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getMusicDetail(res, mysql, context, complete){
        mysql.pool.query("SELECT musicid, sname, composer FROM Music", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.addMusicDetail  = results;
            complete();
        });
    }
    function getClassDetail(res, mysql, context, complete){
        mysql.pool.query("SELECT classid, fname, lname FROM Class", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.addClassDetail  = results;
            complete();
        });
    }



    function getMusic(res, mysql, context, complete){
        mysql.pool.query("SELECT Music.sname, Music.composer, Teach.id, Class.fname, Class.lname FROM Music JOIN Teach ON Music.musicid=Teach.MusicID JOIN Class ON Teach.ClassID=Class.classid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.addMusic  = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = { title: 'addmusictoclass', active: { addmusictoclass: true } };
        var mysql = req.app.get('mysql');
	getClassDetail(res, mysql, context, complete);
	getMusicDetail(res, mysql, context, complete);
        getMusic(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('addmusictoclass', context);
            }

        }
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Teach (ClassID, MusicID) VALUES (?,?)";
        var inserts = [req.body.ClassID, req.body.MusicID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('addmusictoclass');
            }
        });
    });

    router.delete('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Teach WHERE Teach.id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
