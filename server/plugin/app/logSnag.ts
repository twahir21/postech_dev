import { LogSnag } from "logsnag";

const logsnag = new LogSnag({
  token: process.env.LOGSNAG!,
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
  notify: true,
  icon: "✅"
});

export const LogSnag1 = async () => {
  await logsnag.track({
    channel: "errors",
    event: "Database success",
    description: "Insert failed for productId=123",
    notify: true,
    icon: "✅"
  });
}
console.log("Logs sent to LogSnag");
