'use client';

import React from 'react';

interface GoogleMapBlockProps {
  title?: string;
  description?: string;
  mapEmbedUrl: string;
  height?: number;
  address?: string;
  phone?: string;
  email?: string;
  openingHours?: string;
}

export const GoogleMapBlock: React.FC<{
  block: GoogleMapBlockProps;
}> = ({ block }) => {
  const {
    title = 'ที่ตั้งร้านของเรา',
    description,
    mapEmbedUrl,
    height = 450,
    address,
    phone,
    email,
    openingHours,
  } = block || {};

  return (
    <div className="google-map-section" style={{ backgroundColor: '#ffffff', padding: '0' }}>
      <div className="google-map-block">
      <style jsx>{`
        .google-map-block {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          background-color: #ffffff;
          border-radius: 0;
          box-shadow: none;
        }
        
        .map-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 0;
        }
        
        @media (min-width: 992px) {
          .map-container {
            flex-direction: row;
          }
          
          .map-iframe {
            flex: 1;
          }
          
          .contact-info {
            flex: 0 0 350px;
          }
        }
        
        .google-map-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        
        .google-map-description {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 1rem;
          color: #666;
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .map-iframe {
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
        }
        
        .map-iframe iframe {
          width: 100%;
          height: ${height}px;
          border: none;
          display: block;
        }
        
        .contact-info {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
        }
        
        .contact-info h3 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.5rem;
        }
        
        .contact-info h3::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, #007bff, #00c6ff);
          border-radius: 3px;
        }
        
        .contact-item {
          display: flex;
          margin-bottom: 1.5rem;
          align-items: flex-start;
        }
        
        .contact-icon {
          flex: 0 0 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          width: 36px;
          background: linear-gradient(135deg, #007bff, #00c6ff);
          border-radius: 50%;
          margin-right: 1rem;
        }
        
        .contact-icon svg {
          width: 18px;
          height: 18px;
          fill: white;
        }
        
        .contact-text {
          flex: 1;
        }
        
        .contact-text p {
          margin: 0;
          color: #555;
          line-height: 1.6;
        }
        
        .contact-link {
          color: #007bff;
          text-decoration: none;
          transition: color 0.3s;
        }
        
        .contact-link:hover {
          color: #0056b3;
        }
      `}</style>
      
      {title && <h2 className="google-map-title">{title}</h2>}
      {description && <p className="google-map-description">{description}</p>}
      
      <div className="map-container">
        <div className="map-iframe">
          <iframe 
            src={mapEmbedUrl} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade" 
            allowFullScreen
          />
        </div>
        
        {(address || phone || email || openingHours) && (
          <div className="contact-info">
            <h3>ข้อมูลติดต่อ</h3>
            
            {address && (
              <div className="contact-item">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                  </svg>
                </div>
                <div className="contact-text">
                  <p>{address}</p>
                </div>
              </div>
            )}
            
            {phone && (
              <div className="contact-item">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
                  </svg>
                </div>
                <div className="contact-text">
                  <p>
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="contact-link">
                      {phone}
                    </a>
                  </p>
                </div>
              </div>
            )}
            
            {email && (
              <div className="contact-item">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
                  </svg>
                </div>
                <div className="contact-text">
                  <p>
                    <a href={`mailto:${email}`} className="contact-link">
                      {email}
                    </a>
                  </p>
                </div>
              </div>
            )}
            
            {openingHours && (
              <div className="contact-item">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
                  </svg>
                </div>
                <div className="contact-text">
                  <p>{openingHours}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default GoogleMapBlock; 