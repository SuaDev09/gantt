import createHtmlContentFragment from './html-content.helper.js';
import monthDiff from '../utils/month-diff.util';
import dayDiff from '../utils/day-diff.util';
import getDaysInMonth from '../utils/get-days-in-month.util';
import getDayOfWeek from '../utils/get-days-of-week.util';
import createFormattedDateFromDate from '../utils/create-formatted-date-from-date.util';
import createFormattedDateFromStr from '../utils/create-formatted-date-from-str.util';

export default function GanttChart(
  ganttChartElement: HTMLElement,
  tasks: { id: number; name: string }[],
  taskDurations: { id: string; start: Date; end: Date; task: number }[]
) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const contentFragment = createHtmlContentFragment();
  let taskDurationElDragged: HTMLElement | null = null;

  const monthOptionsHTMLStrArr = months.map(
    (month, i) => `<option value="${i}">${month}</option>`
  );
  const years = Array.from(
    { length: 29 },
    (_, i) => `<option value="${2022 + i}">${2022 + i}</option>`
  );

  const fromSelectYear =
    contentFragment.querySelector<HTMLSelectElement>('#from-select-year');
  const fromSelectMonth =
    contentFragment.querySelector<HTMLSelectElement>('#from-select-month');
  const toSelectYear =
    contentFragment.querySelector<HTMLSelectElement>('#to-select-year');
  const toSelectMonth =
    contentFragment.querySelector<HTMLSelectElement>('#to-select-month');
  const containerTasks = contentFragment.querySelector<HTMLDivElement>(
    '#gantt-grid-container__tasks'
  );
  const containerTimePeriods = contentFragment.querySelector<HTMLDivElement>(
    '#gantt-grid-container__time'
  );
  const addTaskForm =
    contentFragment.querySelector<HTMLFormElement>('#add-task');
  const addTaskDurationForm =
    contentFragment.querySelector<HTMLFormElement>('#add-task-duration');
  const taskSelect =
    addTaskDurationForm?.querySelector<HTMLSelectElement>('#select-task');

  if (fromSelectMonth && fromSelectYear && toSelectMonth && toSelectYear) {
    fromSelectMonth.innerHTML = monthOptionsHTMLStrArr.join('');
    fromSelectYear.innerHTML = years.join('');
    toSelectMonth.innerHTML = monthOptionsHTMLStrArr.join('');
    toSelectYear.innerHTML = years.join('');
  }

  function createGrid() {
    if (
      !fromSelectYear ||
      !fromSelectMonth ||
      !toSelectYear ||
      !toSelectMonth ||
      !containerTasks ||
      !containerTimePeriods
    )
      return;

    const startMonth = new Date(
      parseInt(fromSelectYear.value),
      parseInt(fromSelectMonth.value)
    );
    const endMonth = new Date(
      parseInt(toSelectYear.value),
      parseInt(toSelectMonth.value)
    );
    const numMonths = monthDiff(startMonth, endMonth) + 1;

    containerTasks.innerHTML = '';
    containerTimePeriods.innerHTML = '';

    createTaskRows();
    createMonthsRow(startMonth, numMonths);
    createDaysRow(startMonth, numMonths);
    createDaysOfTheWeekRow(startMonth, numMonths);
    createTaskRowsTimePeriods(startMonth, numMonths);
    addTaskDurations();
  }

  function createTaskRows() {
    if (!containerTasks || !taskSelect) return;

    containerTasks.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const emptyRow = document.createElement('div');
      emptyRow.className = 'gantt-task-row';
      containerTasks.appendChild(emptyRow);
    }

    const taskOptionsHTMLStrArr = tasks.map((task) => {
      const taskRowEl = document.createElement('div');
      taskRowEl.id = task.id.toString();
      taskRowEl.className = 'gantt-task-row';

      const taskRowElInput = document.createElement('input');
      taskRowElInput.value = task.name;
      taskRowElInput.addEventListener('change', updateTasks);
      taskRowEl.appendChild(taskRowElInput);

      const taskRowElDelBtn = document.createElement('button');
      taskRowElDelBtn.innerText = '✕';
      taskRowElDelBtn.addEventListener('click', deleteTask);
      taskRowEl.appendChild(taskRowElDelBtn);

      containerTasks.appendChild(taskRowEl);
      return `<option value="${task.id}">${task.name}</option>`;
    });

    taskSelect.innerHTML = taskOptionsHTMLStrArr.join('');
  }

  function createMonthsRow(startMonth: Date, numMonths: number) {
    if (!containerTimePeriods) return;

    containerTimePeriods.style.gridTemplateColumns = `repeat(${numMonths}, 1fr)`;
    let month = new Date(startMonth);

    for (let i = 0; i < numMonths; i++) {
      const timePeriodEl = document.createElement('div');
      timePeriodEl.className = 'gantt-time-period';
      const timePeriodElSpan = document.createElement('span');
      timePeriodElSpan.innerHTML = `${
        months[month.getMonth()]
      } ${month.getFullYear()}`;
      timePeriodEl.appendChild(timePeriodElSpan);
      containerTimePeriods.appendChild(timePeriodEl);
      month.setMonth(month.getMonth() + 1);
    }
  }

  function createDaysRow(startMonth: Date, numMonths: number) {
    if (!containerTimePeriods) return;

    let month = new Date(startMonth);
    for (let i = 0; i < numMonths; i++) {
      const timePeriodEl = document.createElement('div');
      timePeriodEl.className = 'gantt-time-period';
      containerTimePeriods.appendChild(timePeriodEl);

      const numDays = getDaysInMonth(month.getFullYear(), month.getMonth() + 1);
      for (let day = 1; day <= numDays; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'gantt-time-period';
        const dayElSpan = document.createElement('span');
        dayElSpan.innerHTML = day.toString();
        dayEl.appendChild(dayElSpan);
        timePeriodEl.appendChild(dayEl);
      }

      month.setMonth(month.getMonth() + 1);
    }
  }

  function createDaysOfTheWeekRow(startMonth: Date, numMonths: number) {
    if (!containerTimePeriods) return;

    let month = new Date(startMonth);
    for (let i = 0; i < numMonths; i++) {
      const timePeriodEl = document.createElement('div');
      timePeriodEl.className = 'gantt-time-period day';
      containerTimePeriods.appendChild(timePeriodEl);

      const numDays = getDaysInMonth(month.getFullYear(), month.getMonth() + 1);
      for (let day = 1; day <= numDays; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'gantt-time-period';
        const dayOfTheWeek = getDayOfWeek(
          month.getFullYear(),
          month.getMonth(),
          day - 1
        );
        const dayElSpan = document.createElement('span');
        dayElSpan.innerHTML = dayOfTheWeek;
        dayEl.appendChild(dayElSpan);
        timePeriodEl.appendChild(dayEl);
      }

      month.setMonth(month.getMonth() + 1);
    }
  }

  function createTaskRowsTimePeriods(startMonth: Date, numMonths: number) {
    if (!containerTimePeriods) return;

    const dayElContainer = document.createElement('div');
    dayElContainer.className = 'gantt-time-period-cell-container';
    dayElContainer.style.gridTemplateColumns = `repeat(${numMonths}, 1fr)`;
    containerTimePeriods.appendChild(dayElContainer);

    tasks.forEach((task) => {
      let month = new Date(startMonth);
      for (let i = 0; i < numMonths; i++) {
        const timePeriodEl = document.createElement('div');
        timePeriodEl.className = 'gantt-time-period';
        dayElContainer.appendChild(timePeriodEl);

        const numDays = getDaysInMonth(
          month.getFullYear(),
          month.getMonth() + 1
        );
        for (let day = 1; day <= numDays; day++) {
          const dayEl = document.createElement('div');
          dayEl.className = 'gantt-time-period-cell';
          const dayOfTheWeek = getDayOfWeek(
            month.getFullYear(),
            month.getMonth(),
            day - 1
          );
          if (dayOfTheWeek === 'S') dayEl.style.backgroundColor = '#f7f7f7';

          const formattedDate = createFormattedDateFromStr(
            month.getFullYear(),
            month.getMonth() + 1,
            day
          );
          dayEl.dataset['task'] = task.id.toString();
          dayEl.dataset['date'] = formattedDate;
          dayEl.ondrop = onTaskDurationDrop;
          timePeriodEl.appendChild(dayEl);
        }

        month.setMonth(month.getMonth() + 1);
      }
    });
  }

  function addTaskDurations() {
    taskDurations.forEach((taskDuration) => {
      const dateStr = createFormattedDateFromDate(taskDuration.start);
      const startCell = containerTimePeriods?.querySelector<HTMLDivElement>(
        `div[data-task="${taskDuration.task}"][data-date="${dateStr}"]`
      );
      if (startCell) createTaskDurationEl(taskDuration, startCell);
    });
  }

  function createTaskDurationEl(taskDuration: any, startCell: HTMLElement) {
    const dayElContainer = containerTimePeriods?.querySelector<HTMLDivElement>(
      '.gantt-time-period-cell-container'
    );
    if (!dayElContainer) return;

    const taskDurationEl = document.createElement('div');
    taskDurationEl.classList.add('taskDuration');
    taskDurationEl.id = taskDuration.id;

    const days = dayDiff(taskDuration.start, taskDuration.end);
    taskDurationEl.style.width = `calc(${days} * 100%)`;
    taskDurationEl.draggable = true;

    taskDurationEl.addEventListener('dragstart', (e) => {
      taskDurationEl.classList.add('dragging');
      taskDurationElDragged = e.target as HTMLElement;
    });

    taskDurationEl.addEventListener('dragend', () => {
      taskDurationEl.classList.remove('dragging');
    });

    dayElContainer.addEventListener('dragover', (e) => e.preventDefault());

    taskDurationEl.tabIndex = 0;
    taskDurationEl.addEventListener('keydown', (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') deleteTaskDuration(e);
    });

    startCell.appendChild(taskDurationEl);
  }

  function onTaskDurationDrop(e: DragEvent) {
    const targetCell = e.target as HTMLElement;
    if (
      !targetCell ||
      targetCell.hasAttribute('draggable') ||
      !taskDurationElDragged
    )
      return;

    const taskDuration = taskDurations.find(
      (td) => td.id === taskDurationElDragged?.id
    );
    if (!taskDuration) return;

    const dataTask = targetCell.dataset['task'];
    const dataDate = targetCell.dataset['date'];
    if (!dataTask || !dataDate) return;

    taskDurationElDragged.remove();
    const daysDuration = dayDiff(taskDuration.start, taskDuration.end);
    createTaskDurationEl(taskDuration, targetCell);

    const newTask = parseInt(dataTask);
    const newStartDate = new Date(dataDate);
    const newEndDate = new Date(dataDate);
    newEndDate.setDate(newEndDate.getDate() + daysDuration - 1);

    taskDuration.task = newTask;
    taskDuration.start = newStartDate;
    taskDuration.end = newEndDate;

    taskDurations = taskDurations
      .filter((td) => td.id !== taskDurationElDragged?.id)
      .concat(taskDuration);
  }

  function deleteTaskDuration(e: KeyboardEvent) {
    const taskDurationToDelete = e.target as HTMLElement;
    taskDurationToDelete.remove();
    taskDurations = taskDurations.filter(
      (td) => td.id !== taskDurationToDelete.id
    );
  }

  function handleAddTaskDurationForm(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const task = parseInt(
      (form.elements.namedItem('select-task') as HTMLInputElement).value
    );
    const start = (form.elements.namedItem('start-date') as HTMLInputElement)
      .value;
    const end = (form.elements.namedItem('end-date') as HTMLInputElement).value;

    const taskDuration = {
      id: `${Date.now()}`,
      start: new Date(start),
      end: new Date(end),
      task,
    };

    taskDurations.push(taskDuration);
    const startCell = containerTimePeriods?.querySelector<HTMLDivElement>(
      `div[data-task="${taskDuration.task}"][data-date="${start}"]`
    );
    if (startCell) createTaskDurationEl(taskDuration, startCell);
  }

  function handleAddTaskForm(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newTaskName = (form.elements[0] as HTMLInputElement).value;

    const maxIdVal = tasks.reduce(
      (max, task) => Math.max(max, task.id),
      -Infinity
    );
    tasks.push({ id: maxIdVal + 1, name: newTaskName });
    createGrid();
  }

  function updateTasks(e: Event) {
    const input = e.target as HTMLInputElement;
    const taskRow = input.parentElement as HTMLElement;
    const id = parseInt(taskRow.id);
    const value = input.value;

    tasks = tasks
      .filter((task) => task.id !== id)
      .concat({ id, name: value })
      .sort((a, b) => a.id - b.id);
    createGrid();
  }

  function deleteTask(e: Event) {
    const button = e.target as HTMLButtonElement;
    const taskRow = button.parentElement as HTMLElement;
    const id = parseInt(taskRow.id);

    tasks = tasks.filter((task) => task.id !== id);
    taskDurations = taskDurations.filter((td) => td.task !== id);
    createGrid();
  }

  /**
   * Utility function to format a Date object as "yyyy-MM-dd".
   */
  function formatDateToInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Ensure all date values are formatted before assigning to inputs
  function updateDateInputs() {
    if (fromSelectYear && fromSelectMonth && toSelectYear && toSelectMonth) {
      const startDate = new Date(
        parseInt(fromSelectYear.value),
        parseInt(fromSelectMonth.value)
      );
      const endDate = new Date(
        parseInt(toSelectYear.value),
        parseInt(toSelectMonth.value)
      );

      const formattedStartDate = formatDateToInputValue(startDate);
      const formattedEndDate = formatDateToInputValue(endDate);

      // Example: Assign formatted dates to input elements
      const startDateInput =
        document.querySelector<HTMLInputElement>('#start-date');
      const endDateInput =
        document.querySelector<HTMLInputElement>('#end-date');
      if (startDateInput) startDateInput.value = formattedStartDate;
      if (endDateInput) endDateInput.value = formattedEndDate;
    }
  }

  // Call updateDateInputs where necessary
  fromSelectYear?.addEventListener('change', () => {
    createGrid();
    updateDateInputs();
  });
  fromSelectMonth?.addEventListener('change', () => {
    createGrid();
    updateDateInputs();
  });
  toSelectYear?.addEventListener('change', () => {
    createGrid();
    updateDateInputs();
  });
  toSelectMonth?.addEventListener('change', () => {
    createGrid();
    updateDateInputs();
  });

  createGrid();
  ganttChartElement.appendChild(contentFragment);
}
