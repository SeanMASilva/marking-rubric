import { createContext } from "react";
import tutorialRubic from "./welcome/tutorialRubric.json"


type FormAction = {
  type: 'set' | 'unset',
  id: string[] | string,
  value: any
} | {
  type: 'mark',
  id: NodeId[]
  value: any
}

type RubricTreeType = {root:rubricJson, selectedValue:RubricSelectedState} & Record<string, any>

type NodeId = string
type dispatch = ({type, id, value}:FormAction) => void
type RubricContext = {
  rubricTree: RubricTreeType
  dispatch:  dispatch,
  isEditing: boolean,
  questionTotal: Record<NodeId, number>,
  maxActualMarks: Record<NodeId, number>,
  flatTree: Record<NodeId, Group|Option>
}
const RubricContext = createContext<RubricContext>({
  rubricTree: {root:tutorialRubic as rubricJson, selectedValue:undefined},
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
  resetGroup:string,
  jump_down:string,
  jump_up : string,
}
const defaultShortCutContext:ShortCutContext = {
  copy: 'Ctrl+c',
  edit: 'Ctrl+e',
  save: 'Ctrl+s',
  top:  'Ctrl+g',
  resetGroup:'Shift+r',
  jump_down:'e',
  jump_up:'q',
}
const ShortCutContext = createContext<ShortCutContext>(defaultShortCutContext)


export default RubricContext
export { ShortCutContext, defaultShortCutContext }
export type {dispatch, FormAction, NodeId, RubricContext, RubricTreeType}