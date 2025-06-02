import { useContext } from "react"
import RubricContext from "./context"
import type { NodeId } from "./context"
import { get } from "lodash"

const findParent = (state:Group|Option, node:Group | Option): Group|null => {
  if (state.type === 'many' || state.type === 'single') return null
  else if (state.options[node.id]) return state
  else {
    return Object.values<Group|Option>(state.options).reduce((prev:null|Group, curr) => prev || findParent(curr, node),null )
  }
}

type stateMap<T> = (state: any, node: Group|Option, flatState: Record<NodeId, T>, depth ?: number) => T

function mapState<T>(f:stateMap<T>, defaultState ?: any) {
  const {state: state_} = useContext(RubricContext)
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

  return mapF(f, state.root, state.root, {}, 0)
}


export { findParent, mapState}