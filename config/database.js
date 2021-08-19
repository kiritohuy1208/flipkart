const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then((con) => {
      console.log(`MongoDb connected with host: ${con.connection.host}`);
    });
};

module.exports = connectDatabase;
