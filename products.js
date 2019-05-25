module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    function getProduct(res, mysql, context, id, complete) {
    	var sql = "SELECT prodid, pname, pdescription, psize, ppic, pprice FROM Products WHERE prodid = ?;";
    	var inserts = [id];
    	mysql.pool.query(sql, inserts, function (error, results, fields) {
    		if (error) {
    			res.write(JSON.stringify(error));
    			res.end();
    		}
    		context.item = results[0];
    		complete();
    	});
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = { title: 'products', active: { products: true } };
        var mysql = req.app.get('mysql');
        getProducts(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('products', context);
            }

        }
    });

    router.get('/:id', function (req, res) {
    	callbackCount = 0;
    	var context = { title: 'update-products', active: { products: true } };
    	var mysql = req.app.get('mysql');
    	getProduct(res, mysql, context, req.params.id, complete);
    	function complete() {
    		callbackCount++;
    		if (callbackCount >= 1) {
    			res.render('update-products', context);
    		}
    	}
    });

    router.post('/:id', function(req, res){
    	console.log(req.body)
    	console.log(req.params.id)
    	var mysql = req.app.get('mysql');
    	var sql = "UPDATE Products SET pname=?, pdescription=?, psize=?, ppic=?, pprice=? WHERE Products.prodid=?";
    	var inserts = [req.body.pname, req.body.pdescription, req.body.psize, req.body.ppic, req.body.pprice, req.params.id];
    	sql = mysql.pool.query(sql,inserts,function(error, results, fields){
    		if (error){
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
        var sql = "INSERT INTO Products (pname, pdescription, psize, ppic, pprice) VALUES (?,?,?,?,?)";
        var inserts = [req.body.pname, req.body.pdescription, req.body.psize, req.body.ppic, req.body.pprice];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/products');
            }
        });
    });







    return router;
}();
