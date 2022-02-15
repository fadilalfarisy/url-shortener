require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const mongoose = require('mongoose');
const urlParser = require('url');
const Shortener = require('./schema')

mongoose.connect(process.env.URL)
  .then(() => console.log('connected'))
  .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Your first API endpoint
app.post('/api/:shorturl', function (req, res) {

  const text = req.body.url;

  if (urlParser.parse(text).hostname === null) {
    res.json({ error: 'invalid url' });
  }
  else {
    dns.lookup(urlParser.parse(text).hostname, function (err, addresses, family) {
      if (err) {
        return res.json({ error: 'invalid url' })
      }

      const short = new Shortener({
        url: req.body.url
      });

      short.save()
        .then(success => {
          res.json({
            'original_url': req.body.url,
            'short_url': success._id
          });
        }).catch(err => {
          res.send('not saved')
          console.log(err)
        })
    });
  }

});

app.get('/api/shorturl/:short_url', function (req, res) {
  Shortener.find({ _id: req.params.short_url })
    .then(success => {
      res.redirect(success[0].url)
    })
    .catch(err => {
      res.json({ error: 'invalid url' })
    })
})


app.listen(process.env.PORT || 3000, function () {
  console.log(`http://localhost:${3000}`);
});
