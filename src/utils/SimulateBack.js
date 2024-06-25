import { randomDate, randomRange } from "../scripts/scripts";
import DB from "./db.json";

/** @type {ToDo[]} */
const list = randomTodo(15);

/**
 *
 * @param {number} size
 */
function randomTodo(size) {
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

    aux.push(todo);
  }

  return aux;
}

/** @typedef {"high" | "medium" | "low"} Priority */
/** @typedef {{done: boolean | null, name: string | null, priority: Priority | null }} Filters */
/** @typedef {{done: "asc" | "desc" | null, priority: "asc" | "desc" | null}} Sorts */
/** @typedef {{id: number, text: string, due_date: string | null, done: boolean, done_date: string | null, priority: Priority, creation_date: string}} ToDo */

/**
 * Returns all ToDo's
 * @param {number} pag
 * @param {Priority} filter
 * @param {Sorts} sort
 */
export async function GET(
  pag = 1,
  filter = { done: null, name: null, priority: null },
  sort = { done: null, priority: null }
) {
  return list;
}

/**
 * Creates new ToDo
 * @param {ToDo} todo
 * @returns Success or Failure status
 */
export async function POST(todo) {
  list.push(todo);
  return true;
}

/**
 * Updates a ToDo element
 * @param {ToDo} todo
 * @returns Success or Failure status
 */
export async function PUT(todo) {
  list[0] = { ...todo };
  return true;
}

/**
 * Marks done or un-done an specific ToDo
 * @param {number} id
 * @param {boolean} done
 * @returns Success or Failure status
 */
export async function COMPLETE(id, done = true) {
  if (list[0].done === done) return true;

  list[0].done = done;
  list[0].done_date = done ? new Date().toISOString() : null;

  return true;
}
