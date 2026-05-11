import app from "./app.js";
import { migrate } from "./migrate.js";
import { seed } from "./seed.js";

const PORT = process.env.PORT || 3001;

async function start() {
  console.log("\n RT ELECTRONICS — SERVER STARTING");
  await migrate();
  await seed();
  app.listen(PORT, () => {
    console.log(` API:   http://localhost:${PORT}`);
    console.log(` Admin: admin@rtelectronics.com`);
    console.log(` Pass:  admin123\n`);
  });
}

start();
