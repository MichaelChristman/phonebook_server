// // Import the mongoose library for interacting with MongoDB
// const mongoose = require('mongoose');

// // Retrieve command-line arguments for the password, name, and number
// //const password = process.argv[2];
// const name = process.argv[3];
// const number = process.argv[4];

// // Define the MongoDB connection URL using the password provided
// const url = process.env.MONGODB_URI;

// // Configure mongoose to allow flexible queries (disables strict mode for filtering)
// mongoose.set('strictQuery', false);

// // Connect to the MongoDB database
// mongoose.connect(url);

// // Define a schema for storing person data in the database
// const personSchema = new mongoose.Schema({
//     name: String, // Name of the person
//     number: String, // Phone number of the person
// });

// // Create a Mongoose model for interacting with the "persons" collection
// const Person = mongoose.model('Person', personSchema);

// // Check the number of command-line arguments to determine the action
// if (process.argv.length === 3) {
//     //If only the password is provided, retrieve and display all entries in the phonebook
//     Person.find({}).then(result => {
//         console.log('Phonebook:'); // Print a header
//         result.forEach(person => {
//             // Print each person's name and number
//             console.log(person.name, person.number);
//         });
//         mongoose.connection.close(); // Close the database connection
//     });
// } else {
//     // If name and number are also provided, add a new entry to the phonebook
//     const person = new Person({
//         name: `${name}`, // Use the provided name
//         number: `${number}`, // Use the provided number
//     });

//     // Save the new person to the database
//     person.save().then(result => {
//         // Confirm the addition of the new entry
//         console.log(`added ${name} number ${number} to phonebook`);
//         mongoose.connection.close(); // Close the database connection
//     });
// }