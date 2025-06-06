import { LogSnag } from "logsnag";

const logsnag = new LogSnag({
  token: "3ec68e89992c7fcca26153fbd5a245c0",
  project: "postech",
});

await logsnag.track({
  channel: "errors",
  event: "Database Failure",
  description: "Insert failed for productId=123",
  icon: "❌"
});


await logsnag.track({
  channel: "errors",
  event: "Database success",
  description: "Insert failed for productId=123",
  icon: "✅"
});