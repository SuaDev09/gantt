export default interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  dependencies?: string[];
}
