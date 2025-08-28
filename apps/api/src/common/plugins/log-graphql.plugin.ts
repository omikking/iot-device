/**
 * Apollo Server plugin to log every GraphQL operation with colored timestamps.
 * Changes color if more than 1 seconds have passed since the last request.
 */

let lastRequestTime = Date.now();
let colorIndex = 0;
const colors = ['\x1b[31m', '\x1b[34m', '\x1b[32m']; // red, blue, green

export const LogGraphQLPlugin = {
  async requestDidStart(requestContext: { request: any }) {
    const { request } = requestContext;

    const now = Date.now();
    if (now - lastRequestTime > 1000) {
      colorIndex = (colorIndex + 1) % colors.length;
    }
    lastRequestTime = now;

    const color = colors[colorIndex];
    console.log(
      `${color}%s\x1b[0m`,
      `${new Date().toISOString()} Request Time`,
    );

    console.log('GraphQL Operation:', request.operationName);
    console.log('GraphQL Query:', request.query);
    if (request.variables) {
      console.log('Variables:', JSON.stringify(request.variables, null, 2));
    }
    return {};
  },
};
