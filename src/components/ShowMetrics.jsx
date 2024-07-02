/**
 *
 * @param {{
 * metrics: {
 *  high_avg: number,
 *  high_pend: number,
 *  mid_avg: number,
 *  mid_pend: number,
 *  low_avg: number,
 *  low_pend: number,
 *  total_avg: number,
 *  total_pend: number,
 * }
 * }} props
 */
const ShowMetrics = (props) => {
  console.log(props);

  if (!props.metrics) return <h2>There aren't metrics to show!</h2>;

  return (
    <div className="show-metrics">
      <div>Average time to finish tasks: {props.metrics.total_pend}</div>

      <div>
        Average time to finish tasks by priority:
        <ul>
          <li>Low: {props.metrics.low_pend}</li>
          <li>Medium: {props.metrics.mid_pend}</li>
          <li>High: {props.metrics.high_pend}</li>
        </ul>
      </div>
    </div>
  );
};

export default ShowMetrics;
