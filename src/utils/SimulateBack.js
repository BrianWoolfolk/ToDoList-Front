import { DB } from "../App";
import {
  boundaries,
  fromInputDate,
  parseNumber,
  randomDate,
  randomRange,
} from "../scripts/scripts";

/**
 *
 * @param {number} size
 */
export function randomTodo(size) {
  const p = ["high", "medium", "low"];
  const aux = [];

  for (let i = 0; i < size; i++) {
    /** @type {ToDo} */
    const todo = {
      creation_date: randomDate(),
      done: Math.random() > 0.5,
      done_date: null,
      due_date: Math.random() > 0.5 ? randomDate() : null,
      id: i,
      priority: p[randomRange(0, 2)],
      text: "Texto de ejemplo " + i,
    };

    if (todo.done) todo.done_date = randomDate(todo.creation_date);

    aux.push(todo);
  }

  return aux;
}

/** @typedef {"high" | "medium" | "low"} Priority */

export class Filters {
  /** @type {boolean? | undefined} */
  done = undefined;
  /** @type {string? | undefined} */
  text = undefined;
  /** @type {Priority? | undefined} */
  priority = undefined;
  /** @type {Date? | undefined} */
  dueDateFrom = undefined;
  /** @type {Date? | undefined} */
  dueDateTo = undefined;
  /** @type {Date? | undefined} */
  creationDateFrom = undefined;
  /** @type {Date? | undefined} */
  creationDateTo = undefined;
  /** @type {Date? | undefined} */
  doneDateFrom = undefined;
  /** @type {Date? | undefined} */
  doneDateTo = undefined;
  /** @type {string[]? | undefined} */
  tags = undefined;
  /** @type {string? | undefined} */
  assignedUser = undefined;

  createFromObject(obj) {
    for (const key in obj) {
      if (key in this) this[key] = obj[key];
    }
  }

  createURLSearchParams(ignoreEmpty = false) {
    const s = new URLSearchParams();
    for (const key in this) {
      if (this[key] !== undefined && (!ignoreEmpty || this[key])) {
        if (this[key] instanceof Date) {
          s.set(key, this[key].toISOString());
          continue;
        }

        s.set(key, this[key]);
      }
    }

    return s;
  }
}

export class Sorts {
  /** @type {boolean? | undefined} */
  sortByDone = undefined;
  /** @type {boolean? | undefined} */
  sortByText = undefined;
  /** @type {boolean? | undefined} */
  sortByPriority = undefined;
  /** @type {boolean? | undefined} */
  sortByDueDate = undefined;
  /** @type {boolean? | undefined} */
  sortByCreationDate = undefined;
  /** @type {boolean? | undefined} */
  sortByDoneDate = undefined;
  /** @type {boolean? | undefined} */
  sortByAssignedUser = undefined;
  /** @type {string[]? | undefined} */
  sortOrder = undefined;

  createFromObject(obj) {
    for (const key in obj) {
      if (key in this) this[key] = obj[key];
    }
  }

  createURLSearchParams() {
    const s = new URLSearchParams();
    for (const key in this) {
      if (this[key] !== undefined) s.set(key, this[key]);
    }

    return s;
  }
}

export class ToDo {
  /** @type {number} */
  id;
  /** @type {string} */
  text;
  /** @type {Priority} */
  priority;
  /** @type {Date | null} */
  due_date;
  /** @type {string | null} */
  tags;
  /** @type {string | null} */
  assigned_user;
  /** @type {boolean} */
  done;
  /** @type {Date | null} */
  done_date;
  /** @type {Date} */
  creation_date;

  constructor(obj) {
    this.id = 0;
    this.text = "";
    this.priority = "low";
    this.due_date = null;
    this.tags = null;
    this.assigned_user = null;
    this.done = false;
    this.done_date = null;
    this.creation_date = new Date();

    this.createFromObject(obj);
  }

  createFromObject(obj) {
    for (const key in obj) {
      if (key in this) this[key] = obj[key];
    }
  }
}

/**
 * Returns all ToDo's
 * @param {number} pag
 * @param {Filters} filter
 * @param {Sorts} sort
 */
export async function GET(
  pag = 1,
  filter = { done: null, text: null, priority: null },
  sort = { done: null, priority: null }
) {
  let aux = DB;

  if (filter) {
    const priors = ["high", "medium", "low"];
    aux = DB.filter((todo) => {
      if (filter.text && !todo.text.includes(filter.text)) return false;
      if (typeof filter.done === "boolean" && filter.done !== todo.done)
        return false;
      if (priors.includes(filter.priority) && filter.priority !== todo.priority)
        return false;

      return true;
    });
  }

  const maxpage = Math.ceil(aux.length / 10) || 1;
  const pp = boundaries(pag, 1, maxpage);

  return { data: aux.slice(10 * (pp - 1), 10 * pp), page: pp, maxpage };
}

/**
 *
 * @param {number} id
 * @returns
 */
export async function GETID(id) {
  if (id === undefined) return false;
  id = parseNumber(id);
  const itm = DB.find((v) => v.id === id);

  return itm;
}

/**
 * Creates new ToDo
 * @param {string} text
 * @param {string} priority
 * @param {string?} due_date
 * @returns Success or Failure status
 */
export async function POST(text, priority, due_date) {
  const todo = {
    id: DB.length,
    text,
    priority,
    due_date: due_date ? fromInputDate(due_date) : null,
    done: false,
    done_date: null,
    creation_date: new Date(),
  };

  if (!["low", "medium", "high"].includes(priority)) return false;
  if (!text) return false;

  DB.push(todo);
  return true;
}

/**
 * Updates a ToDo element
 * @param {ToDo} todo
 * @returns Success or Failure status
 */
export async function PUT(id, text, priority, due_date) {
  if (id === undefined) return false;
  if (!["low", "medium", "high"].includes(priority)) return false;
  if (!text) return false;

  id = parseNumber(id);
  const index = DB.findIndex((todo) => todo.id === id);

  DB[index] = { ...DB[index], text, priority, due_date };
  return true;
}

/**
 * Marks done or un-done an specific ToDo
 * @param {number} id
 * @param {boolean} done
 * @returns Success or Failure status
 */
export async function COMPLETE(id, done = true) {
  if (DB[0].done === done) return true;

  DB[0].done = done;
  DB[0].done_date = done ? new Date() : null;

  return true;
}
