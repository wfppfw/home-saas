<script setup>
import Typed from 'typed.js'
import { onMounted, ref } from 'vue'

definePageMeta({
  layout: 'clean',
})
const typedElement = ref(null)

// const options = {
//   strings: [
//     '第一段文字',
//     '第二段文字 <strong>支持HTML</strong>',
//     '第三段文字...'
//   ],
//   typeSpeed: 50,    // 打字速度（ms）
//   backSpeed: 30,    // 回退速度
//   loop: true,       // 无限循环
//   showCursor: true, // 显示光标
//   cursorChar: '|'   // 光标符号
// }

// const typed = new Typed('#typed-text', options)
onMounted(() => {
  const value = new Typed(typedElement.value, {
    strings: [`清晨的厦门鼓浪屿，海风裹挟着咸湿的潮气扑面而来。我踩着晨露未晞的石板路向日光岩攀登，转角处三角梅从老别墅的铸铁栏杆间倾泻而下，像被阳光凝固的瀑布。这座被称为"琴岛"的小岛，连晨练的老人都带着韵律感——他们手中的保温杯与石阶碰撞出钢琴般的清脆声响，应和着远处菽庄花园传来的断续琴声2。

6 在龙头路市场，林氏鱼丸的第三代传人将木槌敲打鱼糜的节奏，竟与岛上无处不在的钢琴节奏形成奇妙共鸣。当那颗包裹着虾仁的鱼丸在舌尖爆开时，我忽然理解了本地人说的"海的味道会跳舞"。这种味觉体验在曾厝垵的网红店是找不到的，就像批量印刷的明信片永远复刻不出转角老教堂彩窗投下的光影9。

7 傍晚在港仔后海滨浴场，我遇见带着全套茶具来观日落的茶艺师。紫砂壶嘴升起的水雾与晚霞交融，她将武夷岩茶的"岩骨花香"解读为"海浪在石头上写诗"。这种诗意的在地化表达，或许比千篇一律的"最美打卡点"更接近旅行的本质3。

8 返程渡轮上，翻看手机里记录的78种蓝——晨雾的灰蓝、琉璃窗的孔雀蓝、海浪的钴蓝，突然明白旅行博主说的"用色彩写游记"。当夕阳把船舷染成琥珀色时，我听见两个背包客在争论明天要去哪个岛屿，这场景恰似三年前我在京都锦市场听到的对话5。或许所有旅行最终都是与不同时空的自己重逢，而鼓浪屿的钢琴声，此刻正成为记忆的书签`],
    typeSpeed: 100,
  })
  console.warn(value)
})
</script>

<template>
  <div ref="typedElement" />
</template>

<style>
/* 自定义光标动画 */
.typed-cursor {
  color: #4f46e5;
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* 容器样式 */
.text-container {
  font-family: 'Fira Code', monospace;
  font-size: 2rem;
  min-height: 4rem;
}
</style>
