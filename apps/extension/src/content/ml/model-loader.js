export async function loadModel() {
  const tf = await import("@tensorflow/tfjs");
  await tf.ready();
  const toxicity = await import("@tensorflow-models/toxicity");
  return await toxicity.load(0.7);
}

export function isModelLoaded() {
  return false;
}

export function getModel() {
  return null;
}