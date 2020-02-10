<template>
  <canvas />
</template>

<script>
// https://github.com/svga/SVGAPlayer-Web-Lite
import { Downloader, Parser, Player } from 'svga.lite'
const downloader = new Downloader()

const cached = {}
const caching = {}
const queue = {}

async function parseSvgaData(src) {
  const parser = new Parser()
  const rawData = await downloader.get(src)
  return await parser.do(rawData)
}
async function getSvgaData(src) {
  if (cached[src]) return cached[src]
  if (caching[src]) {
    let resolve
    const prom = new Promise(res => resolve = res)
    queue[src] = queue[src] || []
    queue[src].push(data => resolve(data))
    return await prom
  }

  caching[src] = true
  const data = await parseSvgaData(src)
  cached[src] = data
  if (queue[src] && queue[src].length) {
    queue[src].forEach(cb => cb(data))
    queue[src].length = 0
  }
  return data
}

export default {
  props: {
    /**
     * 是否缓存 svga 解析数据（避免重复加载和解析svga资源）
     *
     * 注意：缓存的数据是全局的，如果页面中的 svga 基本不会重复使用，请不要开户缓存
     */
    cache: {
      type: Boolean,
    },
    loop: {
      type: Number,
      default: 0,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    fillMode: {
      type: String,
      default: 'forwards',
    },
    src: {
      type: String,
      required: true,
    },
    play: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      player: null,
      canplay: false,  
      needPlay: false,
    }
  },
  watch: {
    play(val) {
      val ? this.start() : this.pause()
    },
  },

  async mounted() {
    const player = this.player = new Player(this.$el) // #canvas is HTMLCanvasElement

    player.set({
      loop: this.loop,
      fillMode: this.fillMode,
    })

    const data = this.cache ? (await getSvgaData(this.src)) : (await parseSvgaData(this.src))
    await player.mount(data)

    this.canplay = true

    if (this.needPlay) {
      this.player.start()
    }

    // 事件回调
    player
      .$on('start', () => this.$emit('start'))
      .$on('pause', () => this.$emit('pause'))
      .$on('stop', () => this.$emit('stop'))
      .$on('end', () => this.$emit('end'))
      .$on('clear', () => this.$emit('clear'))
      .$on('process', () => this.$emit('process', player.progress))

    this.autoPlay && player.start()
  },

  methods: {
    start() {
      if (this.player) {
        if (this.canplay) {
          this.player.start()
        } else {
          this.needPlay = true
        }
      }
    },
    pause() {
      if (this.player) this.player.pause()
    },
    stop() {
      if (this.player) this.player.stop()
    },
    clear() {
      if (this.player) {
        this.player.clear()
        this.player = null
      }
    },
  },

  beforeDestroy() {
    this.clear()
  },
}
</script>
