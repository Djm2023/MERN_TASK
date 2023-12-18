const express = require("express");
const app = express();
const dotenv = require("dotenv").config({ path: "./config.env" });
const PORT = process.env.PORT || 3000; // Provide a default port if not specified
const fs = require("fs");
const path = require("path");
const { restClient } = require("polygon.io");
const rest = restClient("uAlZixsOLbWfQNMfdwVjBdvnVwfnSacn");



const stocksDataFile = "stocksData.json";

const fetchTopStocks = async () => {
  try {
    const existingStocks = readStocksData();
    const data = await rest.stocks.aggregates(
      "AAPL",
      1,
      "minute",
      "2023-01-01",
      "2023-01-09"
    );

    const newStocks = data.results?.map((stock) => ({
      symbol: stock.t,
      openPrice: stock.o,
      refreshInterval: Math.floor(Math.random() * 500000) + 1,
      currentPrice: stock.c,
    }));

    const updatedStocks = existingStocks.concat(newStocks);

    const trimmedStocks = updatedStocks.slice(-20);

    fs.writeFileSync(stocksDataFile, JSON.stringify(trimmedStocks));
  } catch (error) {
     
  }
};

const readStocksData = () => {
  try {
    let data = fs.readFileSync(stocksDataFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    
    return [];
  }
};

const jsonFilePath = path.join(__dirname, "stocksData.json");
app.use(express.static(path.dirname(jsonFilePath)));


app.get("/api/data", (req, res) => {
  res.sendFile(jsonFilePath);
});

app.use(express.static(path.join(__dirname , "./client/build")));
app.get('*' , (req,res) => {
    res.sendFile(path.join(__dirname , './client/build/index.html'))
})

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error in building the server", err);
  }
  console.log(`Server is up and running on PORT:${PORT}`);
  fetchTopStocks();
});
