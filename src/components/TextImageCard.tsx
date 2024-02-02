interface Props {
  title: string;
  imageLink: string;
  imageAltText: string;
  bodyText: string;
  link: string;
  linkText?: string;
  reversed?: boolean;
}

const TextImagecard: React.FC<Props> = ({
  title,
  imageLink,
  imageAltText,
  bodyText,
  link,
  linkText = 'See More',
  reversed = false,
}) => {
  return (
    <div className='grid h-[70vh] grid-rows-2 lg:h-[50vh] lg:grid-cols-3 lg:grid-rows-1'>
      <img
        src={imageLink}
        alt={imageAltText}
        className={`${reversed && 'lg:order-1'}  h-full w-full object-cover lg:col-span-2`}
      />
      <div className='flex flex-col justify-between px-4 py-8 text-center lg:col-span-1 lg:px-12 lg:py-24'>
        <h3 className='text-lg lg:text-5xl'>{title}</h3>
        <p className='text-base lg:text-xl'>{bodyText}</p>
        <a
          href={link}
          className='text-sm underline underline-offset-4 transition-all  duration-300 hover:text-tertiary lg:text-lg'
        >
          {linkText}
        </a>
      </div>
    </div>
  );
};

export default TextImagecard;
