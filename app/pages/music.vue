<script setup>
const audioList = [
  {
    name: '稻香',
    artist: '周杰伦',
    url: '/music/audio/稻香.m4a',
    cover: '/music/picture/稻香.jpg',
    lrc: '/music/lrc/稻香.lrc',
  },
]
</script>

<template>
  <div class="min-h-screen bg-dark-800 p-4">
    <MusicPlayer :audio-list="audioList" />
  </div>
</template>
