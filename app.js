const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql');
const user = 'root';

const connection = mysql.createConnection({
	host: 'localhost',
	port: '10005',
	user: user,
	password: user,
	database: 'classicmodels',
});

connection.connect((error) => {
	if (error) {
		console.log(error);
	}
	console.log('Connected');
});

app.get('customer/:id/order', (req, res) => {});

app.get('/customer/:id', (req, res) => {
	const id = req.params.id;
	if (id === 'all') {
		connection.query('SELECT * FROM customers', (error, customers) => {
			if (error) {
				throw error;
			}
			res.json(customers);
		});
	} else {
		connection.query(
			`SELECT * FROM customers WHERE customerNumber = ${id}`,
			(error, customer) => {
				if (error) {
					throw error;
				}
				res.json(customer);
			}
		);
	}
});

app.delete('/customer/:id', (req, res) => {
	const { id } = req.params;

	connection.query(
		`DELETE FROM customers WHERE customerNumber = ${id}`,
		(error, customer) => {
			if (error) {
				throw error;
			}
			res.end();
		}
	);
});

app.post('/customer', (req, res) => {
	const {
		customerNumber,
		customerName,
		contactLastName,
		contactFirstName,
		phone,
		addressLine1,
		addressLine2,
		city,
		state,
		postalCode,
		country,
		salesRepEmployeeNumber,
		creditLimit,
	} = req.body;

	connection.query(
		`INSERT INTO customers VALUES (${customerNumber}, ${isNull(
			customerName
		)}, ${isNull(contactLastName)}, ${isNull(
			contactFirstName
		)}, ${phone}, ${isNull(addressLine1)}, ${isNull(addressLine2)}, ${isNull(
			city
		)}, ${isNull(state)}, ${postalCode}, ${isNull(
			country
		)}, ${salesRepEmployeeNumber}, ${creditLimit})`
	);
	res.end();
});

app.put('/customer', (req, res) => {
  const {customerNumber, column, value} = req.body;
  connection.query(`UPDATE customers SET ${column} = '${value}' WHERE customerNumber = ${customerNumber}`);
  res.end();
}); 

const isNull = (value) => {
	if (typeof value === 'undefined') {
		return null;
	} else {
		return `'${value}'`;
	}
};
app.listen(3000);
