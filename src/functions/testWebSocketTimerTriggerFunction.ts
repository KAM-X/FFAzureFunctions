// import { app, InvocationContext, Timer, output } from "@azure/functions";

// const wpsAction = output.generic({
//     type: 'webPubSub',
//     name: 'action',
//     hub: 'ffhub'
// });

// export async function testTimerTriggerFunction(myTimer: Timer, context: InvocationContext): Promise<void> {
//     context.log('WS Timer function processed request.');

//     context.extraOutputs.set(wpsAction, {
//         actionName: 'sendToAll',
//         data: `Auto Trigger [DateTime: ${new Date()}] Temperature: ${getValue(22, 1)}\xB0C, Humidity: ${getValue(40, 2)}%`,
//         dataType: 'text',
//     });
// }

// app.timer('testWebSocketTimerTriggerFunction', {
//     schedule: '0 */1 * * * *',
//     extraOutputs: [wpsAction],
//     handler: testTimerTriggerFunction
// });

// function getValue(baseNum, floatNum) {
//     return (baseNum + 2 * floatNum * (Math.random() - 0.5)).toFixed(3);
// }