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
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(number) {
                return /^[0-9]{2,3}-[0-9]+$/.test(number);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        minLength: 8,
        required: true
    },
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

