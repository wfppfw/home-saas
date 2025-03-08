<script setup>
import QRCode from 'qrcode'
import { ref } from 'vue'

const inputText = ref('')
const qrCodeImage = ref('')
definePageMeta({
  layout: 'clean',
})

async function generateQRCode() {
  if (inputText.value) {
    try {
      qrCodeImage.value = await QRCode.toDataURL(inputText.value)
    }
    catch (err) {
      console.error('生成二维码失败:', err)
    }
  }
  else {
    console.warn('请输入文本')
  }
}

function downloadQRCode() {
  if (qrCodeImage.value) {
    const link = document.createElement('a')
    link.href = qrCodeImage.value
    link.download = 'qrcode.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<template>
  <div>
    <input v-model="inputText" placeholder="输入文本生成二维码">
    <button @click="generateQRCode">
      生成二维码
    </button>
    <div v-if="qrCodeImage">
      <img :src="qrCodeImage" alt="QR Code">
      <button @click="downloadQRCode">
        下载二维码
      </button>
    </div>
  </div>
</template>

  <style scoped>
  /* 你可以在这里添加一些样式 */
</style>
