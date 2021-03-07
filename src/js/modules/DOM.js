import Euid from './Euid/index.js'
;('use strict')

// /* -------------------------------------------------------------------------- */
// // 의존 모듈 검사

if (!Euid) {
  throw new Error('DOM 모듈이 정상 작동하려면 Euid 모듈이 필요합니다.')
}

/* -------------------------------------------------------------------------- */

// Euid 모듈 멤버 추출
const utils = Euid.utils

//utils 멤버 추출
const { isString, isFunction, makeArray, mixins } = utils

/* -------------------------------------------------------------------------- */
// 폴리필(Polyfill)

if (!Object.entries) {
  Object.entries = (obj) => {
    // Object.keys() IE 9+
    const ownProps = Object.keys(obj)
    let i = ownProps.length
    const resArray = new Array(i)
    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]]
    }
    return resArray
  }
}

/* -------------------------------------------------------------------------- */
// 유틸리티 함수

export const getById = (idName) => {
  return document.getElementById(idName)
}

export const getNode = (selector, context = document) => {
  return context.querySelector(selector)
}

export const getNodeList = (selector, context = document) => {
  return context.querySelectorAll(selector)
}

/* -------------------------------------------------------------------------- */

// vNode 생성 유틸리티
export const createElement = (...rest) => {
  // arguments → args 배열 변경
  const args = makeArray(rest)
  const type = args[0]
  const props = args[1] || {}
  const children = args.slice(2) // 나머지 인자 집합(배열)

  props.children = children

  // type이 함수 컴포넌트인 경우
  if (isFunction(type)) {
    // 함수 호출 (props 전달)
    return type.call(null, props)
  }

  return {
    type: type,
    props: props,
  }
}

// [비공개] 속성 바인딩 유틸리티
const _bindProps = (element, props) => {
  // props 복제
  props = mixins(props)

  // children 속성 제거
  delete props.children

  const propValues = Object.entries(props)
  propValues.forEach((propValue) => {
    const [prop, value] = propValue

    // 클래스 속성 설정
    if (prop === 'className') {
      element.classList.add(value)
    }

    // 이벤트 속성
    const isEventProp = /^on/.test(prop)
    const propIsClassName = prop !== 'className'

    if (isEventProp && propIsClassName) {
      element.addEventListener(prop.replace(/on/, '').toLowerCase(), value)
    }

    // 나머지 속성
    if (!isEventProp && propIsClassName) {
      element.setAttribute(prop, value)
    }
  })
}

// [비공개] vNode 렌더링 유틸리티
const _renderElement = (vNode) => {
  // vNode가 텍스트인 경우
  if (isString(vNode)) {
    return document.createTextNode(vNode)
  }

  // vNode = {type, props}
  // 요소 생성
  const element = document.createElement(vNode.type)

  // 속성 바인딩
  _bindProps(element, vNode.props)

  // 자식(들) 순환
  vNode.props.children
    // 재귀 호출
    .map(_renderElement)
    // 자식 노드 마운트
    .forEach((childNode) => {
      element.appendChild(childNode)
    })

  // 요소 반환
  return element
}

/* -------------------------------------------------------------------------- */

// vNode → DOM 노드 마운트(mount)
export const render = (vNode, domNode) => {
  domNode.appendChild(_renderElement(vNode))
}

/* -------------------------------------------------------------------------- */
// 모듈 내보내기
