import React from "react";
import { client } from "utils/api-client";
let queue = [];

setInterval(sendProfile, 5000);

function sendProfile() {
  if (!queue.length) return Promise.resolve({ success: true });
  const dataSentToServer = [...queue];
  queue = [];
  return client("profile", { data: dataSentToServer });
}
function Profiler({ phases, metadata, ...props }) {
  function reportProfile(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) {
    if (!phases || phases.includes(phase)) {
      queue.push({
        metadata,
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions: [...interactions],
      });
    }
  }
  return <React.Profiler onRender={reportProfile} {...props} />;
}

export { Profiler };
export {unstable_trace as trace, unstable_wrap as wrap} from 'scheduler/tracing'
