var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CaptureSchema   = new Schema({
    title: String,
    file_location: String,
    file_format: String,
    file_name: String
});

module.exports = mongoose.model('Capture', CaptureSchema);