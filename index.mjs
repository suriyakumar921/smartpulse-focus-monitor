import {
  SmartSpectraSDK,
  CameraSelection,
  breathingMetrics,
  cardioMetrics,
  decodeMetrics,
} from '@smartspectra/node-sdk';

const apiKey = process.env.PRESAGE_API_KEY;

if (!apiKey) {
  console.error('Missing PRESAGE_API_KEY environment variable.');
  process.exit(1);
}

const sdk = new SmartSpectraSDK({
  apiKey,
  requestedMetrics: [...breathingMetrics, ...cardioMetrics],
});

sdk.on('processingStatus', (status) => {
  console.log('Processing status:', status);
});

sdk.on('validationStatus', (code, ts, hint) => {
  console.log(Validation [${code}] at ${ts} µs:, hint);
});

sdk.on('metrics', (buf, ts) => {
  const decoded = decodeMetrics(buf);
  console.log(Metrics at ${ts} µs:, decoded);
  console.log('Status Cue: Steady session active — remember to take regular pacing breaks.');
});

sdk.on('error', (code, message, retryable) => {
  console.error(SmartSpectra error [${code}]: ${message} (retryable=${retryable}));
});

sdk.useCamera(CameraSelection.default);
sdk.start();

console.log('SmartPulse Focus & Wellness Monitor started. Press Ctrl+C to stop.');

process.on('SIGINT', async () => {
  console.log('\nStopping SmartPulse Focus & Wellness Monitor...');
  await sdk.stopAsync();
  await sdk.destroy();
  process.exit(0);
});
