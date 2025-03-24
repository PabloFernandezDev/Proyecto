import React, { useState } from 'react'
import Icon from '../assets/Icon';

export const Carrousel = () => {
    const images = [
        'https://picsum.photos/200/300?RANDOM=1',
        'https://picsum.photos/200/300?RANDOM=2',
        'https://picsum.photos/200/300?RANDOM=3'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };

  return (
    <div className='caja'>
      <div className="carousel-container">
            <button 
            className="carousel-button left" 
            onClick={handlePrevious}
            >
            <Icon icon="cheveron-left" size={50} color="black"/>
            </button>
            <div className="carousel-wrapper">
                <figcaption>
                    <img 
                    src={images[currentIndex]} 
                    alt={`Slide ${currentIndex}`} 
                    className="carousel-image"
                    />
                </figcaption>
                <figcaption>
                    <img 
                    src={images[currentIndex]} 
                    alt={`Slide ${currentIndex}`} 
                    className="carousel-image"
                    />
                </figcaption>
                <figcaption>
                    <img 
                    src={images[currentIndex]} 
                    alt={`Slide ${currentIndex}`} 
                    className="carousel-image"
                    />
                </figcaption>
            </div>
            
            <button 
            className="carousel-button right" 
            onClick={handleNext}
            >
            <Icon icon="cheveron-right" size={50} color="black"/>
            </button>
      </div>
    </div>
  )
}
