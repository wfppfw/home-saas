<script setup>
import { computed, ref } from 'vue'

// 游戏状态
const board = ref(Array.from({ length: 9 }).fill(null))
const currentPlayer = ref('X')
const winner = ref(null)
const gameMode = ref('pvp')
const aiDifficulty = ref('hard')

// 胜利组合模式
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // 横
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // 竖
  [0, 4, 8],
  [2, 4, 6], // 对角线
]

// 计算属性
const statusMessage = computed(() => {
  if (winner.value)
    return `${winner.value} 胜利! 🎉`
  if (board.value.every(cell => cell))
    return '平局! 🤝'
  if (gameMode.value === 'vsAI' && currentPlayer.value === 'O')
    return 'AI 思考中...'
  return `当前玩家: ${currentPlayer.value}`
})

const isGameActive = computed(() =>
  !winner.value && board.value.includes(null),
)

// 游戏逻辑
function checkWinner() {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern
    if (board.value[a]
      && board.value[a] === board.value[b]
      && board.value[a] === board.value[c]) {
      return board.value[a]
    }
  }
  return null
}

function makeMove(index) {
  if (board.value[index] || winner.value)
    return

  board.value[index] = currentPlayer.value
  winner.value = checkWinner()

  if (!winner.value) {
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
  }
}

// AI逻辑
function getBestMove() {
  if (aiDifficulty.value === 'easy') {
    const available = board.value
      .map((cell, index) => cell === null ? index : null)
      .filter(cell => cell !== null)
    return available[Math.floor(Math.random() * available.length)]
  }

  // Minimax算法
  const maximize = (tempBoard) => {
    let maxScore = -Infinity
    let bestMove = null

    for (let i = 0; i < 9; i++) {
      if (tempBoard[i] === null) {
        tempBoard[i] = 'O'
        let score = minimax(tempBoard, false)
        tempBoard[i] = null
        if (score > maxScore) {
          maxScore = score
          bestMove = i
        }
      }
    }
    return bestMove
  }

  return maximize([...board.value])
}

function minimax(tempBoard, isMaximizing) {
  const result = checkWinnerForAI(tempBoard)
  if (result === 'O')
    return 1
  if (result === 'X')
    return -1
  if (result === 'tie')
    return 0

  if (isMaximizing) {
    let bestScore = -Infinity
    for (let i = 0; i < 9; i++) {
      if (tempBoard[i] === null) {
        tempBoard[i] = 'O'
        let score = minimax(tempBoard, false)
        tempBoard[i] = null
        bestScore = Math.max(score, bestScore)
      }
    }
    return bestScore
  }
  else {
    let bestScore = Infinity
    for (let i = 0; i < 9; i++) {
      if (tempBoard[i] === null) {
        tempBoard[i] = 'X'
        let score = minimax(tempBoard, true)
        tempBoard[i] = null
        bestScore = Math.min(score, bestScore)
      }
    }
    return bestScore
  }
}

function checkWinnerForAI(tempBoard) {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern
    if (tempBoard[a]
      && tempBoard[a] === tempBoard[b]
      && tempBoard[a] === tempBoard[c]) {
      return tempBoard[a]
    }
  }
  return tempBoard.includes(null) ? null : 'tie'
}

function aiMove() {
  if (currentPlayer.value === 'O' && !winner.value) {
    setTimeout(() => {
      const bestMove = getBestMove()
      if (bestMove !== undefined && board.value[bestMove] === null) {
        makeMove(bestMove)
      }
    }, aiDifficulty.value === 'hard' ? 800 : 300)
  }
}

// 玩家操作处理
function handleMove(index) {
  if (gameMode.value === 'vsAI' && currentPlayer.value === 'O')
    return
  makeMove(index)
  if (gameMode.value === 'vsAI' && !winner.value && isGameActive.value) {
    aiMove()
  }
}

// 重置游戏
function resetGame() {
  board.value = Array.from({ length: 9 }).fill(null)
  currentPlayer.value = 'X'
  winner.value = null
  if (gameMode.value === 'vsAI' && currentPlayer.value === 'X') {
    // 如果AI先手可以在此调用aiMove()
  }
}

// 辅助方法
function isWinningCell(index) {
  if (!winner.value)
    return false
  return winPatterns.some(pattern =>
    pattern.includes(index)
    && pattern.every(i => board.value[i] === winner.value),
  )
}

function isCellDisabled(index) {
  if (board.value[index] || winner.value)
    return true
  if (gameMode.value === 'vsAI') {
    return currentPlayer.value === 'O'
  }
  return false
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    <h1 class="mb-4 text-3xl text-blue-600 font-bold">
      井字棋
    </h1>

    <!-- 模式选择 -->
    <div class="mb-4 flex gap-4">
      <select
        v-model="gameMode"
        class="border rounded-lg bg-white px-4 py-2"
        :disabled="isGameActive"
      >
        <option value="pvp">
          双人对战
        </option>
        <option value="vsAI">
          人机对战
        </option>
      </select>

      <select
        v-if="gameMode === 'vsAI'"
        v-model="aiDifficulty"
        class="border rounded-lg bg-white px-4 py-2"
        :disabled="isGameActive"
      >
        <option value="easy">
          简单模式
        </option>
        <option value="hard">
          困难模式
        </option>
      </select>
    </div>

    <!-- 游戏状态 -->
    <div class="mb-4 text-xl text-gray-700 font-semibold">
      {{ statusMessage }}
    </div>

    <!-- 游戏棋盘 -->
    <div class="rounded-lg bg-white p-4 shadow-lg">
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="(cell, index) in board"
          :key="index"
          class="h-20 w-20 border-2 border-gray-300 rounded text-4xl font-bold transition-colors hover:bg-gray-50"
          :class="{
            'text-blue-500': cell === 'X',
            'text-red-500': cell === 'O',
            'bg-green-100': isWinningCell(index),
          }"
          :disabled="isCellDisabled(index)"
          @click="handleMove(index)"
        >
          {{ cell || ' ' }}
        </button>
      </div>
    </div>

    <!-- 控制按钮 -->
    <button
      class="mt-6 rounded bg-blue-500 px-6 py-2 text-white font-semibold transition-colors hover:bg-blue-600"
      @click="resetGame"
    >
      新游戏
    </button>
  </div>
</template>
