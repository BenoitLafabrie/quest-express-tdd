const app = require("./app");

const port = process.env.port || 3000;

app.listen(3000, (err) => {
  if (err) {
    throw new Error(`An error occurred: ${err.message}`);
  }
  console.log(`Server is listening on ${port}`);
});
