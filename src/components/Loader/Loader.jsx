import { Overlay } from 'components/Overlay/Overley.staled';
import { BounceLoader } from 'react-spinners';

export const Loader = () => {
  return (
    <Overlay>
      <BounceLoader color="rgba(90, 214, 54, 1)" />
    </Overlay>
  );
};
