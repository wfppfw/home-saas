import loadJs from '../utils/loadJs'

export const BASEURL = ''
export const LIVE2D_CDN_JS
    = 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js'
export const LIVE2D_CDN_MODELJSON
    = 'https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/model/'
export const LIVE2D_LOCAL_JS = 'js/live2d.js'
export const LIVE2D_LOCAL_MODELJSON = 'live2d/'

export async function useLive2d(fnEvent: any, name: string, id: string) {
  await loadJs(LIVE2D_LOCAL_JS).then(async () => {
    await window.loadlive2d(
      id,
      `${LIVE2D_LOCAL_MODELJSON + name}/${name}.model.json`,
    )
    fnEvent()
  })
}
