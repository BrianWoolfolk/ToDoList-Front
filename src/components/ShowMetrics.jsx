import { metricsTime } from "../scripts/scripts";

/**
 *
 * @param {{
 * metrics: {
 *  highAvg: number,
 *  highPend: number,
 *  midAvg: number,
 *  midPend: number,
 *  lowAvg: number,
 *  lowPend: number,
 *  totalAvg: number,
 *  totalPend: number,
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
          <p className="main-time">{metricsTime(props.metrics.totalPend)}</p>
        </div>
      </div>

      <div className="metrics-block">
        <b>Average time to finish tasks by priority:</b>

        <div className="metrics-items multiple">
          Low:
          <span>{metricsTime(props.metrics.lowPend)}</span>
          Medium:
          <span>{metricsTime(props.metrics.midPend)}</span>
          High:
          <span>{metricsTime(props.metrics.highPend)}</span>
        </div>
      </div>
    </div>
  );
};

export default ShowMetrics;
