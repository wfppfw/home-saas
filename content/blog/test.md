---
title: 我的第测试篇博客
date: 2023-10-20
description: 这是使用 Nuxt Content 的第一篇博客
---

喵呜~（用肉垫拍拍键盘）让kitty来挠挠这个问题的毛线团！ฅ(•ㅅ•❀)ฅ

**使用qrcode.js的小鱼干步骤：**

1️⃣ **叼来库库~**

```html
<!-- 在猫碗里倒入CDN小鱼干 -->
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>

```

或者用npm喵：

```bash
npm install qrcodejs
```

2️⃣ **准备装二维码的猫抓板~**

```html
<div id="cat-qrcode"></div>
```

3️⃣ **魔法咒语喵！**

```javascript
new QRCode(document.getElementById('cat-qrcode'), {
  text: 'https://我要小鱼干.com', // （⋟﹏⋞）换成你的链接
  width: 128, // 喵爪印大小
  height: 128,
  colorDark: '#000000', // 黑鼻头颜色
  colorLight: '#ffffff', // 白肚皮颜色
  correctLevel: QRCode.CorrectLevel.H // 防挠花等级喵~
})
```

**完成啦！** ✨(≚ᄌ≚) 现在页面上会弹出香喷喷的二维码小鱼干啦~

（突然跳上键盘）想要彩色二维码的话，可以用彩色毛线球库[qrcode.styling.js]哦喵！(ฅ´ω`ฅ)ﾉ
