require('dotenv').config()
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

const WINDOW_SIZE = 10;
const windows = {
  p: [], 
  e: [], 
  f: [], 
  r: []  
};

const AUTH_TOKEN = `Bearer ${process.env.KEY_ACCESS_TOKEN}`;

const apiURLs = {
  p: "http://20.244.56.144/evaluation-server/primes",
  e: "http://20.244.56.144/evaluation-server/even",
  f: "http://20.244.56.144/evaluation-server/fibo",
  r: "http://20.244.56.144/evaluation-server/rando"
};

app.get("/evaluation-server/:type", async (req, res) => {
  const type = req.params.type;

  if (!["p", "e", "f", "r"].includes(type)) {
    return res.status(400).json({ error: "Invalid number type." });
  }

  let prevWindow = [...windows[type]];

  try {
    const response = await fetch(apiURLs[type], {
        headers: {
            Authorization: AUTH_TOKEN,
        }
    })

    data = await response.json()
    console.log(data)

    for (let num of receivedNums) {
      if (!windows[type].includes(num)) {
        windows[type].push(num);
        if (windows[type].length > WINDOW_SIZE) {
          windows[type].shift(); 
        }
      }
    }

    const avg =
      windows[type].reduce((sum, val) => sum + val, 0) / windows[type].length;

    return res.json({
      windowPrevState: prevWindow,
      windowCurrState: windows[type],
      numbers: receivedNums,
      avg: parseFloat(avg.toFixed(2))
    });

  } catch (error) {
    return res.status(500).json({ error: "Failed tp fetch." });
  }
});

app.listen(`${process.env.PORT_NUM}`, () => {
  console.log(`Server running at http://localhost:${process.env.PORT_NUM}`);
});
