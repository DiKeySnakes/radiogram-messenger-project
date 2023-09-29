'use client';

import Modal from '@/app/components/modals/Modal';
import Image from 'next/image';

interface IImageModalProps {
  src?: string | null;
}

const ImageModal: React.FC<IImageModalProps> = ({ src }) => {
  if (!src) {
    return null;
  }

  return (
    <Modal id={src}>
      <div className='w-80 h-80'>
        <Image
          fill
          src={src}
          alt='Image'
          className='object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>
    </Modal>
  );
};

export default ImageModal;
