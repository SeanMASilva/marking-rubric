const newManyGroup = ():ManyOptionGroup => ({
  id: Date.now().toString(),
  type:'manyGroup',
  name:'Label',
  maxMark:'1',
  options:{}
})

const newSingleGroup = ():SingleOptionGroup => {
  const newId = Date.now()
  return ({
    id: newId.toString(),
    type:'singleGroup',
    name:'Label',
    maxMark:'1',
    options:{
      [(newId + 1).toString()]: {
        id:(newId + 1).toString(),
        type:'single',
        name:'This question was not attempted',
        mark:'0',
        selectedString:' ',
        unselectedString:' '
      }
    }
  })
}

const newManyOption = ():ManyOption => ({
  id: Date.now().toString(),
  type: 'many',
  name: 'Label',
  mark: '1',
  selectedString: ' ',
  unselectedString: ' ',
})

const newSingleOption = (): SingleOption  => ({
  id: Date.now().toString(),
  type: 'single',
  name: 'Label',
  mark: '1',
  selectedString: ' ',
  unselectedString: ' ',
})

export {newManyOption   , newManyGroup, newSingleGroup, newSingleOption}