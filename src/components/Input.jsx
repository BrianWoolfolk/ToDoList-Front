import { useCallback, useState } from "react";
import { fromInputDate, intoInputDate, parseID } from "../scripts/scripts";

/**
 * Vague implementation of INPUT.TSX original file, adjusted to work only
 * with few functionalities keeping the semi-controlled way of working.
 *
 * @param {{
 * _store: object,
 * _store_var: string | number,
 * _required?: boolean,
 * _label?: string,
 * _placeholder?: string,
 * _type?: "text" | "date" | "checkbox",
 * _disabled?: boolean,
 * _select_from?: string[]}} props
 * @returns JSX Input semi-controlled
 */
const Input = (props) => {
  const [LS, setLS] = useState(props._store[props._store_var] ?? "");
  const [id] = useState(
    parseID(props._label || "a") + "-" + parseID(props._store_var + "")
  );

  function valid(err, el) {
    el.setCustomValidity(err);
    el.reportValidity();
  }

  const handleChange = useCallback(
    (e) => {
      const el = e.target;
      let val = el.value;

      if (props._type === "checkbox") {
        setLS(el.checked);
        props._store[props._store_var] = el.checked;
        return;
      }

      if (props._required && !val) {
        valid("This field is required", el);
        setLS(val);
        return;
      }

      if (props._type === "date") {
        const dd = val ? fromInputDate(val) : null;
        // bypass 'before today' check
        valid("", el);
        setLS(dd || "");
        // if (dd?.getTime?.())
        props._store[props._store_var] = dd;
        return;
      }

      valid("", el);
      setLS(val);
      props._store[props._store_var] = val;
    },
    [props]
  );

  let input = <></>;

  if (props._select_from !== undefined) {
    input = (
      <select
        id={id}
        className={"input select"}
        disabled={props._disabled}
        required={props._required}
        value={LS}
        onChange={handleChange}
        name={props._store_var}
      >
        {props._select_from.map((value, index) => (
          <option key={index} value={value}>
            {value}
          </option>
        ))}
      </select>
    );
  } else {
    input = (
      <input
        id={id}
        type={props._type}
        autoComplete={"one-time-code"}
        className={"input"}
        name={props._store_var}
        disabled={props._disabled}
        value={LS instanceof Date ? intoInputDate(LS) : LS}
        checked={LS}
        required={props._required}
        placeholder={
          props._placeholder ||
          (props._required ? "Please fill this field" : "<Empty>")
        }
        onChange={handleChange}
      />
    );
  }

  return (
    <>
      {props._label && (
        <label htmlFor={id}>
          {props._label + (props._required ? "*" : "")}
        </label>
      )}

      {input}
    </>
  );
};

export default Input;
