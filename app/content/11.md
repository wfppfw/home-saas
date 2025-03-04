### nuxt3 文件夹

1. app/utils 这个文件夹下放可直接使用的程序函数

```
// utils/randomEntry.ts
// (使用命名导出,或默认导出)

export default function (arr: Array<any>) {
  return arr[Math.floor(Math.random() * arr.length)]
}

```

```
// app.vue (在其他地方直接使用，不需要导入)
<template>
  <p>{{ randomEntry(1234) }}</p>
</template>
```
