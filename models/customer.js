const mongoose = require("mongoose");

const Schema = mongoose.Schema;



const customerSchema = new Schema({
    name: {
        type: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
    },
    documents: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Document"
        }
     ]
    
},  { timestamps: true });


module.exports = mongoose.model("Customer", customerSchema);