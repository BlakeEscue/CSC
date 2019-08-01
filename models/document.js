const mongoose = require("mongoose");

const Schema = mongoose.Schema;



const documentSchema = new Schema({
    
  docType: {
        type: String
    },
    text: {
        type: String
    },
    customer: {
        type: String
    }
    
}, { timestamps: true });


module.exports = mongoose.model("Document", documentSchema);