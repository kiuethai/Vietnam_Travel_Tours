import { Fragment } from "react";
import Counter from "./Counter";

const SectionTitle = ({
  title,
  countValue = 23500,
  subtitle1 = "Website",
  subtitle2 = "trải nghiệm phổ biến nhất",
  bg,
}) => {
  return (
    <Fragment>
      <h2>{title}</h2>
      <p>
        {subtitle1}{" "}
        <span className={`count-text plus ${bg}`}>
          <Counter end={countValue} />
        </span>{" "}
        {subtitle2}
      </p>
    </Fragment>
  );
};
export default SectionTitle;
