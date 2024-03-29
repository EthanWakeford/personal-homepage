interface Props {
  title: string;
  subHeading: string;
  phone: string;
  address: string;
  email: string;
  names: string;
  socials: { link: string; type: string }[];
}

const ContactPage: React.FC<Props> = ({
  subHeading,
  title,
  address,
  email,
  names,
  phone,
  socials,
}) => {
  return (
    <div className='mt-32 lg:mb-48 lg:mt-64 flex flex-col items-center px-8 text-center'>
      <h1 className='mb-4 text-2xl lg:text-4xl'>{title}</h1>
      <h2 className='mb-16 lg:text-xl'>{subHeading}</h2>
      <div className='mb-16 flex flex-col items-center lg:text-xl'>
        {/* <div className='flex size-full items-center justify-center border-b border-r border-neutral-300'>
          <p className='p-4'>{email}</p>
        </div>
        <div className='flex size-full items-center justify-center border-b border-neutral-300'>
          <p className='p-4'>{names}</p>
        </div>
        <div className='flex size-full items-center justify-center border-r border-neutral-300'>
          <p className='p-4'>{phone}</p>
        </div>
        <div className='flex size-full items-center justify-center border-neutral-300'>
          <p className='p-4'>{address}</p>
        </div> */}
        <p className='p-4'>{email}</p>
        <p className='p-4'>{phone}</p>
      </div>
      <nav className='mb-8 flex justify-center gap-4 lg:justify-end lg:gap-8'>
        {socials.map((social) => (
          <a className='text-lg' href={`/${social.link}`} key={social.type}>
            <i
              className={`fa-brands fa-${social.type} text-2xl hover:scale-110 hover:text-tertiary lg:text-4xl`}
            ></i>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default ContactPage;
