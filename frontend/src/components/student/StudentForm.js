import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const StudentForm = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    class: 'Nursery',
    otherClass: '',
    village: '',
    mobileNumber: '',
  });
  const [photo, setPhoto] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [showCamera, setShowCamera] = useState(false);
  const [crop, setCrop] = useState({ aspect: 3 / 4 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  const webcamRef = useRef(null);
  const imgRef = useRef(null);

  const { studentName, fatherName, class: studentClass, otherClass, village, mobileNumber } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
    setShowCamera(false);
  }, [webcamRef]);

  const flipCamera = () => {
    setFacingMode(prevState => (prevState === 'user' ? 'environment' : 'user'));
  };

  const onImageLoad = (e) => {
    imgRef.current = e.currentTarget;
  };

  const makeClientCrop = async (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImage = await getCroppedImg(
        imgRef.current,
        crop,
        'newFile.jpeg'
      );
      setCroppedImageUrl(URL.createObjectURL(croppedImage));
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Handle form submission with cropped image
    console.log({ ...formData, photo: croppedImageUrl });
  };

  return (
    <div>
      <h2>Add Student Data</h2>
      <form onSubmit={onSubmit}>
        {/* Form fields... */}
        <div>
          <input type="text" placeholder="Student Name" name="studentName" value={studentName} onChange={onChange} required />
        </div>
        <div>
          <input type="text" placeholder="Father's Name" name="fatherName" value={fatherName} onChange={onChange} required />
        </div>
        <div>
          <select name="class" value={studentClass} onChange={onChange}>
            <option value="Nursery">Nursery</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
            <option value="8th">8th</option>
            <option value="9th">9th</option>
            <option value="10th">10th</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {studentClass === 'Other' && (
          <div>
            <input type="text" placeholder="Please specify other class/course" name="otherClass" value={otherClass} onChange={onChange} required />
          </div>
        )}
        <div>
          <input type="text" placeholder="Village" name="village" value={village} onChange={onChange} required />
        </div>
        <div>
          <input type="text" placeholder="Mobile Number" name="mobileNumber" value={mobileNumber} onChange={onChange} required />
        </div>

        {/* Photo capture section */}
        <div>
          {!showCamera && !photo && <button onClick={() => setShowCamera(true)}>Take Photo</button>}
          {showCamera && (
            <div>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode }}
              />
              <button onClick={capture}>Capture photo</button>
              <button onClick={flipCamera}>Flip Camera</button>
            </div>
          )}
          {photo && !croppedImageUrl && (
            <div>
              <ReactCrop
                src={photo}
                onImageLoaded={onImageLoad}
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={makeClientCrop}
              />
              <button onClick={() => makeClientCrop(completedCrop)}>Confirm Crop</button>
              <button onClick={() => setPhoto(null)}>Take another photo</button>
            </div>
          )}
          {croppedImageUrl && (
            <div>
              <h3>Cropped Preview</h3>
              <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
              <button onClick={() => setPhoto(null)}>Retake</button>
            </div>
          )}
        </div>

        <input type="submit" value="Add Student" />
      </form>
    </div>
  );
};

export default StudentForm;
