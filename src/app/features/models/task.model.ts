export default interface Task {
  id: number;
  name: string;
  start: Date;
  end: Date;
  duration?: number;
  progress?: number;
  dependencies?: number[];
  parent?: number;
  children?: Task[];
}
