const mongoose = require('mongoose');

const shortenerSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Shortener', shortenerSchema)