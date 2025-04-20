import { useContext, useEffect, useState } from "react"
import RubricContext, { type dispatch } from "./context"

function getCleanRubric(state: Record<string, any>): rubricJson {
  const cleanState:rubricJson = {id: 'root', options: {...state.root.options}, type:'manyGroup', name:state.root.name, maxMark:state.root.maxMark}
  return cleanState
}

function goToTop() {
  const firstCheckBox = document.getElementsByClassName("checkBox")?.[0] as HTMLInputElement
  firstCheckBox?.focus() 
}

function useGoToTop() {
  useEffect(() => {
    const f = (e:KeyboardEvent) => {
      if (e.key === 'g' && (e.ctrlKey || e.metaKey)) {
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
  useEffect(() => {
    const f = (e:KeyboardEvent) => {
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
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


export {goToTop, useGoToTop, saveRubric, useSaveRubric, exportRubric, useImportRubric}