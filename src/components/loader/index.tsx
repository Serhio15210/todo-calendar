import Mosaic from "react-loading-indicators/Mosaic";
import { MosaicProps } from "react-loading-indicators";

const Loader = ({ ...props }: MosaicProps & { isSearch?: boolean }) => {
  return (
    <div className={`loader ${props.isSearch ? "search-loading" : ""}`}>
      <Mosaic
        color={[
          "#646cff",
          "rgba(100, 108, 255, 0.5)",
          "rgba(100, 108, 255, 0.5)",
          "#646cff",
        ]}
        {...props}
      />
    </div>
  );
};

export default Loader;
