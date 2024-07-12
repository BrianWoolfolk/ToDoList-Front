import { metricsTime } from "../scripts/scripts";

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
    <div className="show-metrics" data-testid="showmetrics">
      <div className="metrics-block">
        <b>Average time to finish tasks:</b>

        <div className="metrics-items">
          <p className="main-time">{metricsTime(props.metrics.total_pend)}</p>
        </div>
      </div>

      <div className="metrics-block">
        <b>Average time to finish tasks by priority:</b>

        <div className="metrics-items multiple">
          Low:
          <span>{metricsTime(props.metrics.low_pend)}</span>
          Medium:
          <span>{metricsTime(props.metrics.mid_pend)}</span>
          High:
          <span>{metricsTime(props.metrics.high_pend)}</span>
        </div>
      </div>
    </div>
  );
};

export default ShowMetrics;
