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
/** @typedef {{done: boolean | null, text: string | null, priority: Priority | null }} Filters */
/** @typedef {{done: "asc" | "desc" | null, priority: "asc" | "desc" | null}} Sorts */
/** @typedef {{id: number, text: string, due_date: Date | null, done: boolean, done_date: Date | null, priority: Priority, creation_date: Date}} ToDo */

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
