type rubricJson = ManyOptionGroup
type Group = SingleOptionGroup | ManyOptionGroup
type SingleOptionGroup =  {
  type: 'singleGroup'
  id: string;
  name?: string;
  maxMark: number;
  options: Record<string, SingleOption | ManyOptionGroup>;
}

type ManyOptionGroup = {
  type: 'manyGroup'
  id: string;
  name?: string;
  maxMark: number;
  options: Record<string, ManyOption | ManyOptionGroup | SingleOptionGroup>;
}

// type SingleOption = Option & {type: 'single'}
// type ManyOption = Option & {type: 'many'}
type Option = SingleOption | ManyOption

type SingleOption = {
  type: 'single';
  id: string;
  name: string;
  mark: number;
  selectedString ?: string;
  unselectedString ?: string;
  checked?: boolean;
}
type ManyOption = {
  type: 'many';
  id: string;
  name: string;
  mark: number;
  selectedString ?: string;
  unselectedString ?: string;
  checked?: boolean;
}