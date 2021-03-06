import { add, remove } from 'bianco.events'
import domToArray from 'bianco.dom-to-array'

/**
 * Preload any image
 * @param   { string|HTMLElement } img - Path to the image or image object
 * @returns { Promise } a promise that will be resolved when the image will be completely loaded
 */
export function loadImage(img) {
  const isUrl = typeof img === 'string'
  const i = isUrl ? document.createElement('img') : img

  // this image was already loaded
  if (!isUrl && i.complete) return Promise.resolve(i)

  // the image reference will set to null
  // to avoid memory leaks
  return new Promise((resolve, reject) => {
    const onSuccess = () => {
      remove(i, 'error abort', onError)
      resolve(i)
    }

    const onError = error => {
      remove(i, 'load', onSuccess)
      reject(new Error(error))
    }

    add(i, 'error abort', onError, { once: true })
    add(i, 'load', onSuccess, { once: true })

    if (isUrl) i.src = img
  })
}

/**
 * Load in parallel a collection of images
 * @param   { Array|NodeList } imgs - array of strings or <img> HTML elements
 * @returns { Promise } a promise that will be resolved when all the images will be loaded
 */
export function loadImages(imgs) {
  return Promise.all(domToArray(imgs).map(loadImage))
}


export default {
  loadImage,
  loadImages
}
