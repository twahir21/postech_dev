import { LogSnag } from "logsnag";

const logsnag = new LogSnag({
  token: process.env.LOGSNAG!,
  project: "postech",
});


export const logSnagErrors = async ( description: string, event: string ) => {
  await logsnag.track({
    channel: "errors",
    event: `${event}`,
    description: `${description}`,
    notify: true,
    icon: "❌"
  });
}

export const logSnagSuccess = async ( description: string, event: string ) => {
  await logsnag.track({
    channel: "success",
    event: `${event}`,
    description: `${description}`,
    icon: "✅"
  });
}

