var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();
// Serve files from public folder. That's where all of our HTML, CSS and Angular JS are.
app.use(express.static('public'));
// This allows us to accept JSON bodies in POSTs and PUTs.
app.use(bodyParser.json());

// TODO Set up access to the database via a connection pool. You will then use
// the pool for the tasks below.
var pool = new pg.Pool({
 user: "postgres",
 password: "cookie123",
 host: "localhost",
 port: 5432,
 database: "postgres",
 ssl: false
});

// GET /api/items - responds with an array of all items in the database.
// TODO Handle this URL with appropriate Database interaction.
app.get('/api/items', function(req, res){
  pool.query("select * from shoppingcart").then(function(result){
    res.send(result.rows);
  });
});
// POST /api/items - adds and item to the database. The items name and price
// are available as JSON from the request body.
// TODO Handle this URL with appropriate Database interaction.
app.post('/api/items', function(req, res) {
 var item = req.body; // <-- Get the parsed JSON body
 var sql = "INSERT INTO shoppingcart(product, price, quantity)" +
 "VALUES ($1::text, $2::real, $3::int)";
 var values = [item.product, item.price, item.quantity, item.total];
 pool.query(sql, values).then(function() {
 res.status(201); // 201 Created
 res.send("INSERTED");
 });
});
// DELETE /api/items/{ID} - delete an item from the database. The item is
// selected via the {ID} part of the URL.
// TODO Handle this URL with appropriate Database interaction.
app.delete('/api/items/:id', function(req, res) {
 var id = req.params.id; // <-- Get the parsed JSON body
 pool.query("delete from shoppingcart where id = ($1::int)", [id]).then(function(){
   res.send("deleted");
 });
});


var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('JSON Server is running on ' + port);
});
