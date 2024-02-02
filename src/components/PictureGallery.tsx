import { useState } from 'react';

interface Props {
  images: { imageRef: string; title: string; link?: string }[];
}

interface SelectedImage {
  imageRef: string;
  title: string;
  link?: string;
}

const PictureGallery: React.FC<Props> = ({ images }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );

  const openModal = (image: SelectedImage) => {
    setSelectedImage(image);
    setModalOpen(true);
    console.log(isModalOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <ul className='align-center grid grid-cols-1 text-center sm:grid-cols-2'>
        {images.map((image) => (
          <li
            className={`card-zoom group relative z-10 flex h-64 items-center justify-center bg-cover bg-center hover:cursor-pointer`}
            onClick={() =>
              image.link ? window.open(image.link) : openModal(image)
            }
          >
            <div
              className='card-zoom-image hover:zoom-in z-0 hover:brightness-50'
              style={{ backgroundImage: `url('${image.imageRef}')` }}
            ></div>
            <span className='z-50 text-xl opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100'>
              {image.title}
            </span>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className='fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-0 lg:mt-8'>
          <div className='z-50 m-auto rounded'>
            {selectedImage && (
              <div className='relative'>
                <i
                  className='absolute fa-solid fa-xmark rotate-180 opacity-100 bg-dkbg1 top-0 right-0 rounded-full px-2 mx-2 my-2 flex cursor-pointer justify-end text-4xl text-white transition-transform duration-300 ease-in-out hover:text-red-500'
                  onClick={closeModal}
                >
                </i>
                <img src={selectedImage.imageRef} alt={selectedImage.title} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PictureGallery;
