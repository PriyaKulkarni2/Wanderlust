const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://localhost:27017/wanderlust";

main()
.then(() => {
    console.log("conected to db");
}).catch(err =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:'67ed83757370cae9960924ed'}));
    await Listing.insertMany(initData.data);
    console.log("data initialised");   
};

initDb();