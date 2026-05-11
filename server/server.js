import app from "./app.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n RT ELECTRONICS — SERVER READY`);
  console.log(` API:   http://localhost:${PORT}`);
  console.log(` Admin: admin@rtelectronics.com`);
  console.log(` Pass:  admin123\n`);
});
