
import React, { useContext, useEffect, useReducer, useRef, useState, type MouseEventHandler } from "react";
import {OptionMarking_, RadioInput, Button, Label, GroupMarking_, Row} from "~/styled"
import { TextEdit, NumberEdit, deleteRed, TextAreaEdit, SaveRubric } from "~/ui";
import RubricContext, { defaultShortCutContext, ShortCutContext }from "~/context";
import type { FormAction, NodeId } from "~/context";
import { set, get, unset } from "lodash";
import { exportRubric, goToTop, ShortCuts, useImportRubric, useResetState } from "~/shortcuts";
import defaultRubric from "./tutorialRubric.json"
import { newManyGroup, newManyOption, newSingleGroup, newSingleOption } from "~/defaultRubricItems";
import { findParent, mapState } from "~/util";


function RenderGroup({group, parent} : {group: Group, parent: NodeId[]}) {
  const newParentList = [...parent, group.id]
  const optionTree = parent.flatMap(str => [str, 'options'])
  const {questionTotal, maxActualMarks, isEditing, dispatch} = useContext(RubricContext)
  const resetGroup = useResetState(newParentList)

  const invalidMaxMarks = maxActualMarks[group.id].toString() !== group.maxMark &&  isEditing || questionTotal[group.id] > +group.maxMark

  function addPoint(e:any) {
    const newOption: Option = group.type === 'manyGroup' ? newManyOption() : newSingleOption()
    dispatch({type:'set', id: [...optionTree, group.id, 'options', newOption.id], value:newOption})
  }
  
  function handleDelete(e:any) {
    dispatch({type:'unset', id: [...optionTree, group.id], value:undefined})
  }

  function addGroup(type: 'manyGroup' | 'singleGroup') {
    return (e:any) => {
      const newGroup: Group = type === 'manyGroup' ? newSingleGroup() : newManyGroup()
      dispatch({type:'set', id: [...optionTree, group.id, 'options', newGroup.id], value:newGroup})
    }
  }

  function moveToBottom(e:any) {
    const newId = Date.now().toString()
    const newGroup:Group =  {...group, id:newId}
    handleDelete(1)
    dispatch({type:'set', id: [...optionTree, newId], value:newGroup})
  }

  return (
    <GroupMarking_ depth={parent.length} style={{backgroundColor: invalidMaxMarks ? deleteRed : undefined}}>
      <Row>
        <TextEdit id={[...optionTree, group.id, 'name']}></TextEdit>
        <p style={{width:'0.5em'}}/>[{questionTotal[group.id]}/<NumberEdit id={[...optionTree, group.id, 'maxMark']}/>]
        <Button onClick={resetGroup}></Button>
      </Row>
      {Object.values<Option|Group>(group.options).sort((a, b) => +a.id - +b.id).map(option => option.type === 'single'  || option.type === 'many'
        ? <RenderOption option={option} key={option.id} parent={newParentList}/> 
        : <RenderGroup group={option} key={option.id} parent={newParentList}/>
      )}

      {isEditing && <>
        <Row>
          <Button onClick={addPoint}>Add Point</Button>
          <Button onClick={moveToBottom}>To Bottom</Button>
          <Button onClick={addGroup(group.type)}>Add {group.type === 'manyGroup' ? 'Single Choice' : 'MultiChoice'} Section</Button>
          {group.id === 'root' ?
            <Button onClick={addGroup('singleGroup')}>Add Mutli Choice Section</Button> :
            <Button
              onClick={handleDelete}
              style={{backgroundColor:deleteRed}}
            > 
              Delete
            </Button>
          }
        </Row>
      </>}
    </GroupMarking_>
  ) 
}

function RenderOption({option, parent} : {option: Option, parent: NodeId[]}) {
  const {state, dispatch, isEditing} = useContext(RubricContext)
  const optionTree = parent.flatMap(str => [str, 'options'])
  const checked = get(state, [...parent, option.id], false)

  function handleDelete(e:any) {
    dispatch({type:'unset', id: [...optionTree, option.id], value:undefined})
  }

  function moveToBottom(e:any) {
    const newId = Date.now().toString()
    const newOption:Option =  {...option, id:newId}
    handleDelete(1)
    dispatch({type:'set', id: [...optionTree, newId], value:newOption})
  }


  useEffect(() => {
    dispatch({type:'mark', id: [...parent, option.id], value:false})
  }, [state.rerender])

  return (
    <OptionMarking_ depth={parent.length}>
      <Row>
        {!isEditing && <RadioInput
          type={option.type === 'single' ? 'radio' : 'checkbox'}
          checked={checked}
          value={option.name}
          id={option.id}
          onChange={e => dispatch({value: e.target.checked, type: 'mark', id:[...parent, option.id]})}
          className="checkBox"
        />}
        {isEditing && <Label htmlFor={option.id}>Label: </Label>}
        <TextEdit id={[...optionTree, option.id, 'name']} labelId={option.id} inputProps={{id:option.id}}/>
        <p style={{width: '1em'}}/>{'('}
        <NumberEdit id={[...optionTree, option.id, 'mark']} inputProps={{size:1}}>
          {(value:string) => <>&nbsp;{`mark${value === '1' ? '' : 's'}`}</>}
        </NumberEdit>
        {')'}
      </Row>
      {isEditing && <>
        <Row>
          <Label htmlFor={option.id + 'selectedString'}>
            Feedback when {option.type === 'many' ? 'correct' : 'selected'}: 
          </Label>
          <TextAreaEdit  id={[...optionTree, option.id, 'selectedString']} inputProps={{id: option.id + 'selectedString'}}/>
        </Row>
        {option.type === 'many' && <Row>
          <Label htmlFor={option.id + 'unselectedString'}>Feedback when incorrect: </Label>
          <TextAreaEdit  id={[...optionTree, option.id, 'unselectedString']} inputProps={{id:option.id + 'unselectedString'}}/>
        </Row>}
        <Row>
          <Button onClick={moveToBottom}>
            To Bottom
          </Button>
          <Button 
            onClick={handleDelete}
            style={{backgroundColor:`light-dark(#e44,${deleteRed})`}}
          >
            Delete
          </Button>
        </Row>
      </>}
    </OptionMarking_>
  )
}

function ButtonRow({}) {
  const { state } = useContext(RubricContext)
  const { importRubric } = useImportRubric()
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <ToggleEdit />
      <SaveRubric />
      <Button onClick={e => {
        exportRubric(state)
      }}
      >
        Export Rubric
      </Button>
      <Button onClick={e=> {
        fileInputRef.current?.click()
      }}>
        Import Rubric
      </Button>
      <ShortCuts />
      <input type='file' style={{display:'none'}} ref={fileInputRef} onChange={importRubric}/>
    </>
  )
}

function ToggleEdit({}) {
  const {state, dispatch} = useContext(RubricContext)
  
  return (
    <Button onClick={e => dispatch({value: !state.isEditing, type:'set', id:'isEditing'})}>
      Edit Rubric
    </Button>
  )
}

function FeedBack({}){
  const { state, questionTotal } = useContext(RubricContext)
  

  const feedBack = mapState<string[]>((s, n, fs, d) => {
    if (n.type === 'many' || n.type === 'single') {
      const maxMark = n.type === 'many' ? n.mark : findParent(state.root, n)?.maxMark
      if (s === true) return n.selectedString ? [n.name + ": " + n.selectedString + `[${n.mark}/${maxMark}]`] : []
      else if (s === false) return n.unselectedString ? [n.name + ": " + n.unselectedString + `[0/${maxMark}]`] : [n.name + ` [0/${n.mark}]`]
      else return []
    } else {
      return Object.values(s).length ?  [[...[n.name ? (n.name + ` [${questionTotal[n.id]}/${n.maxMark}]`): []], ...Object.keys(n.options).map(key => fs[key])].join("\n")] : []
    }
  })
  const richFeedBack = mapState<string[]>((s, n, fs, d) => {
    if (n.type === 'many' || n.type === 'single') {
      const maxMark = n.type === 'many' ? n.mark : findParent(state.root, n)?.maxMark
      if (s === true) return n.selectedString ? ["<p><strong>" + n.name + ": </strong>" + n.selectedString + ` <strong>[${n.mark}/${maxMark}]</strong></p>`] : []
      else if (s === false) return n.unselectedString ? ["<p><strong>" + n.name + ": </strong> " + n.unselectedString + ` <strong>[0/${maxMark}]</strong></p>`] : []
      else return []
    } else {
      return Object.values(s).length ? [[...[n.name ? ("<h3>" + n.name + ` [${questionTotal[n.id]}/${n.maxMark}]` + "</h3>"): []], (n.type === 'manyGroup' ? '<ul>' : '') + [...Object.keys(n.options).map(key => fs[key])].join("\n") + (n.type === 'manyGroup' ? '</ul>' : '')].join("\n")] : []
    }
  })
  useEffect(() => {
    const copy = async (e:KeyboardEvent) => {
      if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        const data = new ClipboardItem({
          "text/plain": (feedBack.root[0]),
          "text/html": (richFeedBack.root[0])
        })
        await navigator.clipboard.write([data])
      }
    }
    document.addEventListener('keydown', copy)
    return () => document.removeEventListener('keydown', copy)
  }, [state.root])



  return (
    <>
      <h2>Generated Feedback</h2>
      <Row>
        <Button onClick={async e => {
          const data = new ClipboardItem({
            "text/plain": (feedBack.root[0]),
            "text/html": (richFeedBack.root[0])
          })
          await navigator.clipboard.write([data])
        }}>Copy Text</Button>
        <Button onClick={goToTop}>To Top</Button>
      </Row>
      <div dangerouslySetInnerHTML={{__html: richFeedBack.root[0]}} />
    </>
  )
}


type formReducer = (state: Record<string, any>, {id, value, type}: FormAction) => Record<string,any>
const reducer:formReducer = (state, action) => {
  const newState = {...state}
  if (action.type === 'mark') {
    set(newState, action.id, action.value)
    // Make sure or values are unique in the group
    const orCheck = (state:any, path:NodeId[], node:Group|Option):any => {
      const [id, ...restPath] = path
      if (!id) return state
      node = node as Group
      const nextNode = node.options[id]
      const nextValue = state[id]
      if (node.type === 'singleGroup') {
        return {[id]: orCheck(nextValue, restPath, nextNode)}
      }
      const defaultChecked = Object.fromEntries(Object.entries(node.options).map(([key, _]) => ([key, false])))
      return {...defaultChecked, ...state, [id]:orCheck(nextValue, restPath, nextNode)}
    }
    return {...newState, root: {...newState.root, ...orCheck(newState.root, action.id.slice(1), newState.root)}}
  }
  else if (action.type === 'set') {
    set(newState, action.id, action.value)
  } else if (action.type === 'unset') {
    unset(newState, action.id)
  }
  return newState
}

function RubricTree({}) {

  const rubric: rubricJson = JSON.parse(window.localStorage.getItem("rubric") as string) || defaultRubric

  const [state, dispatch] = useReducer(reducer, {root:rubric})
  
  console.log(state)
  const questionTotal = mapState((s, n, fs:Record<string, number>) => {
    return (n.type === 'many' || n.type === 'single') 
    ? s === true
      ? +n.mark 
      : 0 
    : Object.keys(n.options).reduce((p, c) => p + fs[c], 0)}
  , state)
  const maxActualMarks = mapState((s, n, fs:Record<string, number>) => {
    return (n.type === 'many' || n.type === 'single') 
    ?  Math.max(+n.mark, 0)
    : (n.type === 'manyGroup')
    ? Object.keys(n.options).reduce((p, c) => p + fs[c], 0)
    : Math.max(...Object.keys(n.options).map(k => fs[k]))
  }, state)
  const flatTree = mapState<Group|Option>((s, n, fs) => n, state)

  return (
    <RubricContext.Provider value={{
      state,
      dispatch,
      isEditing: !!state.isEditing,
      questionTotal,
      maxActualMarks,
      flatTree,
    }}>
        <ShortCutContext.Provider value={defaultShortCutContext}>
          <div style={{display:'flex', flexDirection:'row'}}>
            <div style={{display:'flex', flexDirection:'column', padding: '8px', width:state.isEditing ? '100%' : '50%'}}>
              <Row>
                <ButtonRow />
              </Row>
              <RenderGroup group={state.root} parent={[]}/>
            </div>
            {!state.isEditing && <div style={{padding: '8px', width:'50%'}}>
              <FeedBack />
            </div>}
          </div>
        </ShortCutContext.Provider>
    </RubricContext.Provider>
  )
}

export {RubricTree}