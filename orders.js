
module.exports = function(){
    var express = require('express');
    var router = express.Router();
    
    function getOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT Student.sfname, Student.slname, quantity, tprice, orderNum FROM Orders INNER JOIN Student ON Orders.studentid = Student.studid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Order  = results;
            complete();
        });
    }

   
    function getProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Products", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Product  = results;
            complete();
        });
    }

    function getStudents(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Student", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Student  = results;
            complete();
        });
    }
	
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = { title: 'orders', active: { orders: true } };
        var mysql = req.app.get('mysql');
        getOrders(res, mysql, context, complete);
        getProducts(res, mysql, context, complete);
	getStudents(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('orders', context);
            }

        }
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Orders (quantity, tprice, studentid) VALUES (?,(?*?),?)";
        var inserts = [req.body.quantity, req.body.quantity, req.body.tprice, req.body.studentid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('orders');
            }
        });
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Orders WHERE Orders.orderNum = ?";
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
    

