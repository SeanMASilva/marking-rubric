import { useContext } from "react"
import RubricContext from "./context"
import type { NodeId } from "./context"
import { get } from "lodash"

const findParent = (state:Group|Option, id: NodeId): Group|null => {
  const path = getNodePathFromId(state, id, [])
  const parent = path.at(-2) as Group
  return parent || null
}

const getNodePathFromId = (state:Group|Option, id:NodeId, path:(Group|Option)[] = []) : (Group|Option)[] => {
  const newPath = [...path, state]
  if (state.id === id) return newPath
  else if (state.type === 'many' || state.type === 'single') return []
  else return Object.values<Group|Option>(state.options).reduce((prev:(Group|Option)[],curr) => {
    const subPath = getNodePathFromId(curr, id, newPath)
    return subPath.length ? subPath : prev
  }, [])
}

type stateMap<T> = (state: any, node: Group|Option, flatState: Record<NodeId, T>, depth ?: number) => T

function mapState<T>(f:stateMap<T>, defaultState ?: any) {
  const {rubricTree: state_} = useContext(RubricContext)
  const state = defaultState || state_
  const mapF = (f:stateMap<T>, state:any, node:Group|Option, flatState:Record<string, any>, depth:number):Record<string, T> => {
    if (node.type === 'many'  || node.type === 'single') {
      return {[node.id]: f(state, node, flatState)}
    } else {
      const nextNodes = Object.entries<Group|Option>(node.options)
      const childrenFlatState: Record<string, T> = {...flatState, 
        ...nextNodes.reduce((prev, [key, node]) => ({...prev, ...mapF(f, get(state, key, {}), node, flatState, depth + 1)}), {})
      }

      return {...childrenFlatState, [node.id]:f(state, node, childrenFlatState)}
      
    }
  }

  return mapF(f, get(state, 'selectedValue.root', {}), state.root, {}, 0)
}

function unselectedValue(node:Group|Option): RubricSelectedState{
  switch (node.type) {
    case ('many'):
      return false
    case ('single'):
      return false
    case ('manyGroup'):
      return Object.fromEntries(Object.entries(node.options).map(([k,v]) => [k, unselectedValue(v)]))
    case ('singleGroup'):
      const child = Object.keys(node.options).at(-1) as string
      return {[child]:unselectedValue(node.options[child])}
  }
}

export { findParent, getNodePathFromId, mapState, unselectedValue }