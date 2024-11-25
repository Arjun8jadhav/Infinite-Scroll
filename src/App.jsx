import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null); 
  const [errorMsg, setErrorMsg] = useState("");

  const fetchImages = async () => {
    if (loading) return; // Avoid duplicate API calls
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?page=${page}&client_id=FEuMsNs4ph5eNRgYmCQHW88RHlVGcOkDvIf-eBhwDZk`
      );
      const data = await response.json();
      
      // Append the fetched images to the existing ones
      setImages((prev) => [...prev, ...data]);
      console.log("Fetched page:", page);
    } catch (error) {
      setErrorMsg("Error fetching images");
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  
    fetchImages();
  }, [page]); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1); // Increment page on scroll
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
