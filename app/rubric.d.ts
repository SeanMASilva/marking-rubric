type rubricJson = ManyOptionGroup
type Group = SingleOptionGroup | ManyOptionGroup
type SingleOptionGroup =  {
  type: 'singleGroup'
  id: string;
  name?: string;
  maxMark: string;
  options: Record<string,Group | Option>;
}

type ManyOptionGroup = {
  type: 'manyGroup'
  id: string;
  name?: string;
  maxMark: string;
  options: Record<string, Group|Option>;
}

// type SingleOption = Option & {type: 'single'}
// type ManyOption = Option & {type: 'many'}
type Option = SingleOption | ManyOption

type SingleOption = {
  type: 'single';
  id: string;
  name: string;
  mark: string;
  selectedString ?: string;
  unselectedString ?: string;
  checked?: boolean;
}
type ManyOption = {
  type: 'many';
  id: string;
  name: string;
  mark: string;
  selectedString ?: string;
  unselectedString ?: string;
  checked?: boolean;
}

interface RubricGroupSelected extends Record<string, RubricSelectedState> {}
type RubricOptionSelected = boolean | undefined
type RubricSelectedState = RubricGroupSelected | RubricOptionSelected | any