/* eslint-disable no-undef */
import * as tf from '@tensorflow/tfjs'

export default () => {
  const contentImage = ref(null)
  const styleImage = ref(null)
  const model = shallowRef(null)

  const loadModel = async () => {
    model.value = await tf.loadGraphModel('models/style-transfer/model.json')
  }

  const applyStyleTransfer = async () => {
    const content = await loadImage(contentImage.value)
    const style = await loadImage(styleImage.value)

    const contentTensor = tf.browser.fromPixels(content)
    const styleTensor = tf.browser.fromPixels(style)

    const output = model.value.predict([contentTensor, styleTensor])
    return tf.browser.toPixels(output)
  }

  return {
    contentImage,
    styleImage,
    applyStyleTransfer,
    loadModel,
  }
}
