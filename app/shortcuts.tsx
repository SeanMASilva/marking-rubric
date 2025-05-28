import { useContext, useEffect, useRef, useState } from "react"
import RubricContext, { ShortCutContext } from "./context"
import { Button, Card } from "./styled"

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
  const {state, dispatch} = useContext(RubricContext)
  const {edit} = useContext(ShortCutContext)
  const validEvent = evaluateShortCutString(edit)
  useEffect(() => {
    const f = (e:KeyboardEvent) => {
      if (validEvent(e)) {
        e.preventDefault()
        dispatch({value: !state.isEditing, type:'set', id:'isEditing'})
      }
    }
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [state])
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
  const {state} = useContext(RubricContext)
  const {save} = useContext(ShortCutContext)
  const validEvent = evaluateShortCutString(save)
  useEffect(() => {
    const f = (e:KeyboardEvent) => {
      if (validEvent(e)) {
        e.preventDefault()
        saveRubric(state)
      }
    }
    document.addEventListener("keydown", f)
    return () => document.removeEventListener('keydown', f)
  }, [state.root])
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
  const {state, dispatch} = useContext(RubricContext)
  // const importRubric = (rubric:rubricJson) => {
  //   window.localStorage.setItem('rubric', JSON.stringify(rubric))
  //   dispatch({type:'set', id:'root', value:rubric})
  //   dispatch({type: 'set', id:'rerender', value: !state.rerender})
  // }
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
      dispatch({type: 'set', id:'rerender', value: !state.rerender})
      
    }

  return {importRubric}
}

function useGroupJumpUp() {
  const { state } = useContext(RubricContext)
  const {jump_up} = useContext(ShortCutContext)
  const validEvent = evaluateShortCutString(jump_up)
useEffect(() => {
  const f = (e:KeyboardEvent) => {
    if (validEvent(e)) {
      const currId = document.activeElement?.id

      if (!currId) return

      const getNextId = (group:Group, candidate:string|null): [string|null, string|null, string|null] => {

        return Object.values<Group|Option>(group.options).reduce(([currCandidate, nextCandidate, res]:[string|null, string|null, string|null], node) => {
          if (res) return [null, null, res]
          if (node.id === currId) return [null, null, currCandidate]
          if (node.type === 'many' || node.type === 'single') {
            return [currCandidate, node.id, res]
          }
          const [_, next, res_]  = getNextId(node, nextCandidate || currCandidate)
          return [next, next, res_]
        }, [candidate, null, null])

      }
      const [_, __, nextId] = getNextId(state.root, null)
      console.log(nextId)
      const elem = document.querySelector(`[id="${nextId}"]`) as HTMLInputElement
      elem?.focus()
    }
  }
  document.addEventListener("keydown", f)

  return () => document.removeEventListener('keydown', f)
}, [state])
  
}


function useGroupJumpDown() {
  const { state } = useContext(RubricContext)
  const {jump_down} = useContext(ShortCutContext)
  const validEvent = evaluateShortCutString(jump_down)

  useEffect(() => {
    const f = (e:KeyboardEvent) => {
      if (validEvent(e)) {
        
        const currId = document.activeElement?.id
        if (!currId) return
       
        
        const getNextId = (group:Group, parentId:string|null, nextId:string|null):[string|null, string|null] => {
          if (nextId) {
            return [parentId, nextId]
          }
          return Object.entries<Group|Option>(group.options).reduce(([pid, nid]:[string|null, string|null], [id, curr]:[string, Group|Option]) => {
            if (nid) return [pid, nid]
            else if (curr.type === 'many' || curr.type === 'single') {
              if (group.id === pid) {
                return [pid, nid]
              } else if (id === currId) {
                return [group.id, null]
              } else if (pid) {
                return [pid, id]
              } else {
                return [pid, nid]
              }
            }
            else {
              return getNextId(curr, pid, nid)
            }
          }, [parentId, nextId])
        } 

        const [_, nextId]  = getNextId(state.root, null, null)
        const elem = document.querySelector(`[id="${nextId}"]`) as HTMLInputElement
        elem?.focus()
      }
    }
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [state])
}

function ShortCuts({}) {
  useGoToTop()
  useSaveRubric()
  useToggleEdit()
  useGroupJumpDown()
  useGroupJumpUp()

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
        <p>E: Jump down to next group</p>
        <p>Q: Jump up to previous group</p>
      </Card>
    </>
  )
}

export {goToTop, useGoToTop, saveRubric, useSaveRubric, exportRubric, useImportRubric, ShortCuts}