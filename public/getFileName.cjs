const fs = require('fs')
const path = require('path')

function getSortedFiles(dirPath) {
  // 读取目录下的所有文件和文件夹名称
  const items = fs.readdirSync(dirPath)

  // 过滤出文件（排除子目录）
  const files = items.filter((item) => {
    const itemPath = path.join(dirPath, item)
    return fs.statSync(itemPath).isFile()
  })

  // 按字母顺序排序
  return files.sort((a, b) => a.localeCompare(b))
}

// 使用示例
const directoryPath = './image' // 替换为你的文件夹路径
try {
  const sortedFiles = getSortedFiles(directoryPath)
  console.log(sortedFiles)
}
catch (error) {
  console.error('出错:', error.message)
}
