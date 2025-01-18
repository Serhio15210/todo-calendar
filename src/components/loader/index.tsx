import Mosaic from "react-loading-indicators/Mosaic";
import { MosaicProps } from "react-loading-indicators";

const Loader = ({ ...props }: MosaicProps & { isSearch?: boolean }) => {
  return (
    <div className={`loader ${props.isSearch ? "search-loading" : ""}`}>
      <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} {...props} />
    </div>
  );
};

export default Loader;
