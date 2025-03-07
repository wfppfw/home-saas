function loadJs(src: string, type?: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(src)) {
      resolve()
    }
    else {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = src
      script.id = src
      if (type === 'async') {
        script.async = true
      }
      if (type === 'defer') {
        script.defer = true
      }
      document.body.appendChild(script)
      script.onload = () => {
        resolve()
      }
      script.onerror = () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject()
      }
    }
  })
}

export default loadJs
