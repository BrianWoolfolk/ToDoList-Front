import { clockLike } from "../scripts/scripts";

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
  if (!props.metrics) return <h2>There aren't metrics to show!</h2>;

  return (
    <div className="show-metrics">
      <div>
        Average time to finish tasks (filters considered):{" "}
        {clockLike(props.metrics.total_pend)}
      </div>

      <div>
        Average time to finish tasks by priority:
        <ul>
          <li>Low: {clockLike(props.metrics.low_pend)}</li>
          <li>Medium: {clockLike(props.metrics.mid_pend)}</li>
          <li>High: {clockLike(props.metrics.high_pend)}</li>
        </ul>
      </div>
    </div>
  );
};

export default ShowMetrics;
