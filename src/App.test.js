import { render, screen } from "@testing-library/react";
import { fromInputDate, intoInputDate } from "./scripts/scripts";
import ShowTable from "./components/ShowTable";
import ShowMetrics from "./components/ShowMetrics";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

test("intoinputdate & frominputdate cancel each other", () => {
  // Variables
  const utc = new Date("2020-11-30"); // UTC 0
  // remove 11 - 1 because months start on 0
  const local = new Date(2020, 11 - 1, 30); // UTC-7

  // utc !== local
  expect(utc).not.toEqual(local);

  // Adjust for UTC:
  // here (UTC-7) is "2020-11-29" + 17hrs
  // but there (UTC 0) is "2020-11-30" + 0hrs

  // `intoinputdate` simply comunicates like:
  // UTC 0 + intoinputdate = UTC -7

  // So if a due date is at "2020-11-30" (UTC 0)
  // you would see "2020-11-29" (UTC-7)

  // frominputdate makes the oposite

  // 2020-11-30  =>  2020-11-29 (local ISO)
  const res1 = intoInputDate(utc);
  // 2020-11-29 (local ISO) => 2020-11-30
  const res2 = fromInputDate(res1);

  // Since we remove the Time mark, we can only check for Date
  // res1               == "2020-11-29"
  // res2.toISOString() == "2020-11-29T07:00:00.000Z"
  expect(res2.toISOString().startsWith(res1)).toBeTruthy();
});

test("showtable is empty at first", () => {
  render(
    <RouterProvider
      router={createBrowserRouter([{ path: "/", element: <ShowTable /> }])}
    />
  );
  const emptycell = screen.getByText("Empty!");
  expect(emptycell).toHaveAttribute("colSpan", "5");

  const table = screen.getByTestId("showtable");
  expect(table).toContainElement(emptycell);
});

test("metrics is empty at first", () => {
  render(<ShowMetrics />);
  const metrics = screen.queryByTestId("showmetrics");
  expect(metrics).not.toBeInTheDocument();
});
