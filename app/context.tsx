import { createContext } from "react";

type FormAction = {
  type: 'set' | 'unset',
  id: string[] | string,
  value: any
} | {
  type: 'mark',
  id: NodeId[]
  value: any
}

type rubricSelectedState = boolean | undefined | {[key:NodeId]: rubricSelectedState}

type NodeId = string
type dispatch = ({type, id, value}:FormAction) => void
type RubricContext = {
  state: Record<string, any>,
  value: rubricSelectedState
  dispatch:  dispatch,
  isEditing: boolean,
  questionTotal: Record<NodeId, number>,
  maxActualMarks: Record<NodeId, number>,
  flatTree: Record<NodeId, Group|Option>
}
const RubricContext = createContext<RubricContext>({
  state: {},
  value: {},
  dispatch: (a) => {},
  isEditing: false,
  questionTotal: {},
  maxActualMarks: {},
  flatTree: {}
})

type ShortCutContext = {
  copy: string,
  edit: string,  
  save: string,
  top : string,
  reset:string,
  jump_down:string,
  jump_up : string,
}
const defaultShortCutContext:ShortCutContext = {
  copy: 'Ctrl+c',
  edit: 'Ctrl+e',
  save: 'Ctrl+s',
  top:  'Ctrl+g',
  reset:'Shift+r',
  jump_down:'e',
  jump_up:'q',
}
const ShortCutContext = createContext<ShortCutContext>(defaultShortCutContext)


export default RubricContext
export { ShortCutContext, defaultShortCutContext }
export type {dispatch, FormAction, NodeId}