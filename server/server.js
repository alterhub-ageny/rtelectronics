import app from "./app.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n RT ELECTRONICS — SERVER STARTING`);
  console.log(` API:   http://localhost:${PORT}\n`);
});
