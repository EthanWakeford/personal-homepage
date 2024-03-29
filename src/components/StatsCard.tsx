import { useInViewport } from 'react-in-viewport';
import { useRef, useState } from 'react';

interface Props {
  title: string;
  body: string;
}

const StatsCard: React.FC<Props> = ({ body, title }) => {
  const ref = useRef(null);
  const { inViewport } = useInViewport(ref, { threshold: 0.5 });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  if (inViewport && !shouldAnimate) setShouldAnimate(true);

  return (
    <div className='h-[80vh] px-8 lg:px-32 bg-dkbg2 text-white'>
      <div
        ref={ref}
        className={`${shouldAnimate ? 'fade-in-up' : 'opacity-0'} flex h-full flex-col items-center justify-around`}
      >
        <h3 className='text-xl'>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  );
};

export default StatsCard;
