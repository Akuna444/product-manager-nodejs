const MongoDB = require("mongodb");
const { MongoClient } = MongoDB;

let _db;

const monogoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://akuna444:lYlyqPjkwCsbU51A@cluster0.ex41jje.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      _db = client.db();
      callback();
    })
    .catch((err) => console.log(err));
};

function getDb() {
  if (_db) {
    return _db;
  }
  throw new Error("No such database found");
}

exports.monogoConnect = monogoConnect;
exports.getDb = getDb;
