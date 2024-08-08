const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
const products = fs.readFileSync(`./data/data.json`, 'utf-8');
const data = JSON.parse(products);

const overviewTemp = fs.readFileSync('./templates/overview.html', 'utf-8');
const cardOverviewTemp = fs.readFileSync(
  './templates/overview-card.html',
  'utf-8'
);
const productTemp = fs.readFileSync('./templates/product.html', 'utf-8');

const formCard = function (temp, product) {
  let card = temp.replace(/{%PRODUCT-NAME%}/g, product.productName);
  card = card.replace(/{%PRODUCT-IMAGE%}/g, product.url);
  card = card.replace(/{%PRODUCT-BRAND%}/g, product.brand);
  card = card.replace(/{%PRODUCT-PRICE%}/g, product.price);
  card = card.replace(/{%ID%}/g, product.id);
  card = card.replace(/{%PRODUCT-ICON%}/g, product.image);

  return card;
};
// using http request
// const server = http.createServer((req, res) => {
//   const routing = req.url;
//   if (routing === '/overview' || routing === '/') {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     let allProducts = '';
//     data.forEach((product) => {
//       allProducts += formCard(cardOverviewTemp, product);
//     });
//     let output = overviewTemp.replace(/{%PRODUCT-CARDS%}/g, allProducts);
//     res.end(output);
//   } else {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end('<img src="smart-phone.jpg" alt="error" style="{height:7rem}">');
//   }
// });
// server.listen(8000, '127.0.0.1', () => {
//   console.log('console is listening at port 8000');
// });

// using express
app.get('/overview', (req, res) => {
  let allProducts = '';
  data.forEach((product) => {
    allProducts += formCard(cardOverviewTemp, product);
  });
  let output = overviewTemp.replace(/{%PRODUCT-CARDS%}/g, allProducts);
  res.status(200).send(output);
});
app.get('/product', (req, res) => {
  const { pathname, query } = url.parse(req.originalUrl, true);
  let output = productTemp.replace(
    /{%PRODUCT%}/g,
    formCard(cardOverviewTemp, data[+query.id])
  );
  res.status(200).send(output);
});

const PORT = 8000;
app.listen(PORT, 'localhost', () => {
  console.log(`Serverr is listening on port ${PORT}`);
});
