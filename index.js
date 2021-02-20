const http = require("http");
const fs = require("fs");
const url = require("url");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const apiData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //   Overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const tempHtml = apiData
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", tempHtml);
    res.end(output);

    // Product
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = apiData[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }
  //   Page not found
  else {
    res.writeHead(404);
    res.end("<h1>Pagr Not Found..</h1>");
  }
});

server.listen(3000, () => {
  console.log("listening..");
});
