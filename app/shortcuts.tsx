import { useContext, useEffect, useRef, useState } from "react"
import RubricContext, { ShortCutContext, type dispatch, type NodeId } from "./context"
import { Button, Card } from "./styled"
import { getNodePathFromId, unselectedValue } from "./util"

function getCleanRubric(state: Record<string, any>): rubricJson {
  const cleanState:rubricJson = {id: 'root', options: {...state.root.options}, type:'manyGroup', name:state.root.name, maxMark:state.root.maxMark}
  return cleanState
}

function evaluateShortCutString(string:string): (e:KeyboardEvent) => boolean {
  const sections = string.split("+")
  const evalSection = (e:KeyboardEvent, str:string) => {
    if (str === 'shift') return e.shiftKey
    if (str === 'alt') return e.altKey
    if (str === 'ctrl') return e.ctrlKey || e.metaKey
    else return str === e.key.toLocaleLowerCase()
  }
  return e => sections.reduce((prev:boolean, curr:string) => prev && evalSection(e, curr.trim().toLowerCase()), true)
}

function useToggleEdit() {
  const {rubricTree, dispatch} = useContext(RubricContext)
  const {edit} = useContext(ShortCutContext)
  const validEvent = evaluateShortCutString(edit)
  useEffect(() => {
    const f = (e:KeyboardEvent) => {
      if (validEvent(e)) {
        e.preventDefault()
        dispatch({value: !rubricTree.isEditing, type:'set', id:'isEditing'})
      }
    }
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [rubricTree])
}

function goToTop() {
  const firstCheckBox = document.getElementsByClassName("checkBox")?.[0] as HTMLInputElement
  firstCheckBox?.focus() 
}

function useGoToTop() {
  const {top} = useContext(ShortCutContext)
  const validEvent = evaluateShortCutString(top)
  useEffect(() => {
    const f = (e:KeyboardEvent) => {
      if (validEvent(e)) {
        e.preventDefault()
        goToTop()
      }
    }
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [])
}

function saveRubric(state: Record<string,any>) {
  const cleanState = getCleanRubric(state)
  window.localStorage.setItem('rubric', JSON.stringify(cleanState))
}

function useSaveRubric() {
  const {rubricTree} = useContext(RubricContext)
  const {save} = useContext(ShortCutContext)
  const validEvent = evaluateShortCutString(save)
  useEffect(() => {
    const f = (e:KeyboardEvent) => {
      if (validEvent(e)) {
        e.preventDefault()
        saveRubric(rubricTree)
      }
    }
    document.addEventListener("keydown", f)
    return () => document.removeEventListener('keydown', f)
  }, [rubricTree.root])
}

function exportRubric(state: Record<string,any>) {
  const cleanState = getCleanRubric(state)
  const file = new Blob([JSON.stringify(cleanState, undefined, 2)])
  const blobURL = URL.createObjectURL(file)
  const cleanup = () => URL.revokeObjectURL(blobURL)
  const a = document.createElement('a')
  a.download = 'rubric.json'
  a.href = blobURL
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  cleanup()
  document.body.removeChild(a)
}

function useImportRubric() {
  const {rubricTree, dispatch} = useContext(RubricContext)

  async function importRubric(e:React.ChangeEvent<HTMLInputElement>) {
      if (!e.target.files) return
      const file = e.target.files[0]
      const rubric: rubricJson = await new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = function(event) {
          const json = event.target?.result as string
          resolve(JSON.parse(json))
        }
    
        fileReader.onerror = reject
        fileReader.readAsText(file)
      })
      // window.localStorage.setItem('rubric', JSON.stringify(rubric))
      dispatch({type:'set', id:'root', value:rubric})
      dispatch({type: 'set', id:'rerender', value: !rubricTree.rerender})
      
    }

  return {importRubric}
}

type groupJump2 = [string|null, string|null]
type groupJump3 = [string|null, string|null, string|null]

function useGroupJumpUp() {
  const { rubricTree, isEditing } = useContext(RubricContext)
  const {jump_up} = useContext(ShortCutContext)
  const validEvent = evaluateShortCutString(jump_up)
  useEffect(() => {
    const f = (e:KeyboardEvent) => {
      if (validEvent(e) && !isEditing) {
        const currId = document.activeElement?.id

        if (!currId) return

        const getNextId = (group:Group, candidate:string|null): groupJump3=> {

          return Object.values<Group|Option>(group.options).sort((a, b) => +a.id - +b.id).reduce(([currCandidate, nextCandidate, res]:groupJump3, node) => {
            if (res) return [null, null, res]
            if (node.id === currId) return [null, null, currCandidate]
            if (node.type === 'many' || node.type === 'single') {
              return [currCandidate, node.id, res]
            }
            const [_, next, res_]  = getNextId(node, nextCandidate || currCandidate)
            return [next, next, res_]
          }, [candidate, null, null])

        }
        const [_, __, nextId] = getNextId(rubricTree.root, null)
        const elem = document.querySelector(`[id="${nextId}"]`) as HTMLInputElement
        elem?.focus()
      }
    }
    document.addEventListener("keydown", f)

    return () => document.removeEventListener('keydown', f)
  }, [rubricTree])
  
}

function useResetState(path:NodeId[]) {
  const { rubricTree, flatTree, dispatch } = useContext(RubricContext)
  return () => resetState(path, rubricTree, dispatch, flatTree)
}

function resetState(path:NodeId[], rubricTree:Record<string,any>, dispatch:dispatch, flatTree:Record<NodeId, Group|Option>) {
  const parent:Group = path.reduce((prev, curr):Group => flatTree[curr].type === 'manyGroup' || flatTree[curr].type === 'singleGroup' ? flatTree[curr] : prev, rubricTree.root)
  const newValue = parent.id === 'root' ? {...rubricTree.root, ...unselectedValue(parent) as Object} : unselectedValue(parent)

  dispatch({type:'mark', id:path, value: newValue})
}

function useResetStateShortcut() {
  const { rubricTree, dispatch, flatTree, isEditing } = useContext(RubricContext)
  const { resetGroup } = useContext(ShortCutContext)
  const validEvent = evaluateShortCutString(resetGroup)
  useEffect(() => {
    const f = (e:KeyboardEvent) => {
      if (validEvent(e) && !isEditing) {
        const currId = document.activeElement?.id
        if (!currId) return

        const pathToParent = getNodePathFromId(rubricTree.root, currId).slice(undefined, -1)
        resetState(pathToParent.map(n => n.id), rubricTree, dispatch, flatTree)
      }
    }
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [rubricTree])
}

function useGroupJumpDown() {
  const { rubricTree, isEditing } = useContext(RubricContext)
  const {jump_down} = useContext(ShortCutContext)
  const validEvent = evaluateShortCutString(jump_down)

  useEffect(() => {
    const f = (e:KeyboardEvent) => {
      if (validEvent(e) && !isEditing) {
        
        const currId = document.activeElement?.id
        if (!currId) return
       
        
        const getNextId = (group:Group, parentId:string|null, nextId:string|null):groupJump2 => {
          if (nextId) {
            return [parentId, nextId]
          }
          return Object.values<Group|Option>(group.options).sort((a, b) => +a.id - +b.id).reduce(([pid, nid]:groupJump2, curr:Group|Option):groupJump2 => {
            if (nid) return [pid, nid]
            else if (curr.type === 'many' || curr.type === 'single') {
              if (group.id === pid) {
                return [pid, nid]
              } else if (curr.id === currId) {
                return [group.id, null]
              } else if (pid) {
                return [pid, curr.id]
              } else {
                return [pid, nid]
              }
            }
            else {
              return getNextId(curr, pid, nid)
            }
          }, [parentId, nextId])
        } 

        const [_, nextId]  = getNextId(rubricTree.root, null, null)
        const elem = document.querySelector(`[id="${nextId}"]`) as HTMLInputElement
        elem?.focus()
      }
    }
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [rubricTree])
}

function ShortCuts({}) {
  useGoToTop()
  useSaveRubric()
  useToggleEdit()
  useGroupJumpDown()
  useGroupJumpUp()
  useResetStateShortcut()

  const modalRef = useRef<HTMLDialogElement>(null)
  return (
    <>
      <Button onClick={e => {e.stopPropagation(); e.preventDefault(); modalRef.current?.showModal();}}>
        Show Shortcuts
      </Button>
      <Card ref={modalRef} title="Shortcuts">
        <p>Ctrl + S: Save rubric to local storage</p>
        <p>Ctrl + C: Copy generated feedback to clipboard</p>
        <p>Ctrl + G: Focus the top check box</p>
        <p>Ctrl + E: Toggle Edit mode</p>
        <p>Shift+ R: Reset section to empty</p>
        <p>E: Jump down to next group</p>
        <p>Q: Jump up to previous group</p>
      </Card>
    </>
  )
}

export {goToTop, useGoToTop, useResetState, saveRubric, useSaveRubric, exportRubric, useImportRubric, ShortCuts}