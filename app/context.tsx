import { createContext } from "react";

type FormAction = {
  type: 'set' | 'mark' | 'unset',
  id: string[] | string,
  value: any
}

type NodeId = string
type dispatch = ({type, id, value}:FormAction) => void
type RubricContext = {
  state: Record<string, any>,
  dispatch:  dispatch,
  isEditing: boolean,
  questionTotal: Record<NodeId, number>,
  maxActualMarks: Record<NodeId, number>,
}
const RubricContext = createContext<RubricContext>({
  state: {},
  dispatch: (a) => {},
  isEditing: false,
  questionTotal: {},
  maxActualMarks: {},
})

type ShortCutContext = {
  copy:string,
  edit:string,  
  save:string,
  top: string,
  jump_down:string,
  jump_up:string,
}
const defaultShortCutContext:ShortCutContext = {
  copy:'Ctrl+c',
  edit:'Ctrl+e',
  save:'Ctrl+s',
  top: 'Ctrl+g',
  jump_down:'e',
  jump_up:'q',
}
const ShortCutContext = createContext<ShortCutContext>(defaultShortCutContext)


export default RubricContext
export { ShortCutContext, defaultShortCutContext }
export type {dispatch, FormAction, NodeId}