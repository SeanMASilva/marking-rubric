const testRubric:rubricJson = {
  id: 'root',
  type: 'manyGroup',
  name: "Overall",
  maxMark: 10,
  options: {
    a1: {
      id: "a1",
      type:"manyGroup",
      maxMark:2,
      name:'Question 1',
      options: {
        a2: {
          id:"a2",
          type:"many",
          mark:1,
          name: "Does it render?",
          selectedString: 'Selected 1',
          unselectedString: "you Suck"
        },
        a3: {
          id:"a3",
          type:"many",
          mark:1,
          name: "Does it render?2",
          selectedString: 'Selected 2',
        }
      }
    },
    b1: {
      id: 'b1',
      type: 'singleGroup',
      maxMark: 2,
      name: 'Question 2',
      options: {
        b2: {
          id: 'b2',
          type: 'single',
          mark: 2,
          name: 'option1',
          selectedString: 'Good job'
        },
        b3: {
          id: 'b3',
          type: 'single',
          mark: 1,
          name: 'option2'
        },
        b4 : {
          id: 'b4',
          type: 'manyGroup',
          maxMark: 2,
          options: {
            b5: {
              id:'b5',
              type: 'many',
              mark: 1,
              name: 'nested opt 3'
            },
            b6: {
              id:'b6',
              type: 'many',
              mark: 1,
              name: 'nested opt 4'
            }
          }
        }
      }
    }
  }
}

export default testRubric