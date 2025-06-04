import React, {useContext} from "react"
import RubricContext from "./context"
import { Button, Label, TextAreaInput, TextInput } from "./styled"
import _ from "lodash"
import { saveRubric } from "./shortcuts"
const {get, isFunction} = _

const deleteRed = 'light-dark(#e44, #a00000)'

function NumberEdit({id, children, labelId, inputProps} : {id: string[], children?:any, labelId?:string, inputProps?:any}) {
  return TextEdit({
    id, 
    children, 
    labelId, 
    inputProps:{
      size: 1,
      type:'number', 
      ...inputProps, 
      style:{
        margin: '0', 
        appearance: 'textfield', 
        MozAppearance: 'textfield', 
        width: 'auto',
        border: '0',
        ...inputProps?.style
      }
    }
  })
}
type EditChild = (value: string) => React.ReactNode
function TextEdit({id, children, labelId, inputProps} : {id: string[], children?:EditChild, labelId?:string, inputProps?:any}) {
  const {rubricTree, dispatch, isEditing} = useContext(RubricContext)
  const value = get(rubricTree, id, "")
  return( 
    <>
      {isEditing 
        ? <TextInput 
          value={value} 
          onChange={e => dispatch({value: e.target.value, type:'set', id})}
          {...inputProps}
          />
        : <Label htmlFor={labelId}>{value}</Label>
      }
      {isFunction(children) && children(value)}
    </>
  )
}

function TextAreaEdit({id, children, labelId, inputProps} : {id: string[], children?:EditChild, labelId?:string, inputProps?:any}) {
  const {rubricTree, dispatch, isEditing} = useContext(RubricContext)
  const value = get(rubricTree, id, "")
  return( 
    <>
      {isEditing 
        ? <TextAreaInput
          value={value} 
          onChange={e => dispatch({value: inputProps?.type === 'number' ? Number(e.target.value) : e.target.value, type:'set', id})}
          {...inputProps}
          />
        : <Label htmlFor={labelId}>{value}</Label>
      }
      {isFunction(children) && children(value)}
    </>
  )
}

function SaveRubric({}) {
  const {rubricTree} = useContext(RubricContext)
  return (
    <Button onClick={() => saveRubric(rubricTree)}>Save Rubric</Button>
  )
}

export {TextEdit, TextAreaEdit, NumberEdit, SaveRubric, deleteRed}