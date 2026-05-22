const { MongoMemoryServer } = require('mongodb-memory-server');
(async () => {
  try {
    console.log("Starting in-memory MongoDB download and instance...");
    const mongod = await MongoMemoryServer.create();
    console.log("Success! URI:", mongod.getUri());
    await mongod.stop();
  } catch (err) {
    console.error("Error:", err);
  }
})();
