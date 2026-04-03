import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();
const host = "0.0.0.0";

app.listen(env.PORT, host, () => {
  console.log(`BillSathi API listening on ${host}:${env.PORT}`);
});
