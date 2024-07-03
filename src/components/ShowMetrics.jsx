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
      <div className="metrics-block">
        <b>Average time to finish tasks (filters considered):</b>

        <div className="metrics-items">
          <p style={{ alignSelf: "center" }}>
            {clockLike(props.metrics.total_pend)} minutes
          </p>
        </div>
      </div>

      <div className="metrics-block">
        <b>Average time to finish tasks by priority:</b>

        <div className="metrics-items">
          <p>Low: {clockLike(props.metrics.low_pend)} mins</p>
          <p>Medium: {clockLike(props.metrics.mid_pend)} mins</p>
          <p>High: {clockLike(props.metrics.high_pend)} mins</p>
        </div>
      </div>
    </div>
  );
};

export default ShowMetrics;
