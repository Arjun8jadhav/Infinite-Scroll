import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null); 


  
  const fetchImages = async () => {
    if (loading) return; 
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?page=${page}&client_id=FEuMsNs4ph5eNRgYmCQHW88RHlVGcOkDvIf-eBhwDZk`
      );
      const data = await response.json();

 
      setImages((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchImages();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, []);
 

  return (
    <div>
      <div className="images-container">
        {images.map((image, index) => (
          <img
            key={`${page}+${image.id}`}
            src={image.urls.small} 
            alt={image.alt_description || `Image ${index + 1}`}
          />
        ))}
      </div>
      <div ref={loaderRef} style={{ height: '50px', background: 'lightgray' }}>
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}

export default App;
