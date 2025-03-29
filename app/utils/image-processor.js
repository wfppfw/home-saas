export default {
  async convertFormat(imageUrl, format, quality) {
    const img = await loadImage(imageUrl)
    const canvas = new OffscreenCanvas(img.width, img.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    return canvas.convertToBlob({
      type: `image/${format}`,
      quality,
    })
  },
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = src
  })
}
