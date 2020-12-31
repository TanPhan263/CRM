const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://myMongoDBUser:Abc123456@cluster0-lvepn.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true }, (err) => {
    if (!err)
        console.log('MongoDB connection succeeded.');
    else
        console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2));
});

module.exports = mongoose;