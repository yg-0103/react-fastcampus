import * as logger from './logger.js'
;('use strict')

/* -------------------------------------------------------------------------- */
// 타입 검사 유틸리티

export const typeIs = (data) => {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
}

export const isNumber = (data) => {
  return typeIs(data) === 'number'
}

export const isString = (data) => {
  return typeIs(data) === 'string'
}

export const isBoolean = (data) => {
  return typeIs(data) === 'boolean'
}

export const isFunction = (data) => {
  return typeIs(data) === 'function'
}

export const isArray = (data) => {
  return typeIs(data) === 'array'
}

export const isObject = (data) => {
  return typeIs(data) === 'object'
}

/* -------------------------------------------------------------------------- */
// 배열 유틸리티

export const makeArray = (likeArray) => {
  return [...likeArray]
}

/* -------------------------------------------------------------------------- */
// 시리얼라이즈 유틸리티

export const serialize = (data, prettiy) => {
  return !prettiy ? JSON.stringify(data) : JSON.stringify(data, null, 2)
}

export const deserialize = (json) => {
  return JSON.parse(json)
}

/* -------------------------------------------------------------------------- */
// 믹스인 유틸리티

export const mixins = (...rest) => {
  return makeArray(rest).reduce((o1, o2) => {
    for (let key in o2) {
      if (o2.hasOwnProperty(key)) {
        let o1Value = o1[key]
        let o2Value = o2[key]
        if (isObject(o2Value)) {
          o1Value && _checkValueType(isObject, o1Value, key)
          o1[key] = mixins(o1Value || {}, o2Value)
        } else if (isArray(o2Value)) {
          o1Value && _checkValueType(isArray, o1Value, key)
          o1[key] = (o1Value || []).concat(o2Value)
        } else {
          o1[key] = o2Value
        }
      }
    }
    return o1
  }, {})
}

const _checkValueType = (method, value, key) => {
  if (!method(value)) {
    let message = `혼합할 각 객체 ${key} 속성 유형이 다릅니다.`
    if (logger) {
      logger.error(message)
    } else {
      throw new Error(message)
    }
  }
}

/* -------------------------------------------------------------------------- */
// 모듈 내보내기
