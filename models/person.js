const mongoose = require('mongoose');

const url = process.env.MONGO_URL;

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(err => {
        console.log('error connecting to MongoDB:', err.message)
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        // hide unwanted field in response as default
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj._id;
        delete returnedObj.__v;
    }
})

module.exports = Person;

