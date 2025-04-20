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
const RubricContext = createContext<RubricContext>({state: {}, isEditing: false} as RubricContext)
export default RubricContext
export type {dispatch, FormAction, NodeId}