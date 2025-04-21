"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CiSearch } from 'react-icons/ci';
import Image from 'next/image';
import opp from "@/public/opp.svg";
import { format } from 'date-fns';
import upload from '@/public/upload.svg'
import toast, { Toaster } from 'react-hot-toast';
import LoadingSpinner from '../shared/LoadingSpinner';
import dynamic from 'next/dynamic';

// Import the rich text editor dynamically with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const SubmitOpportunity = ({ onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'internship', // Default value
    institution: '',
    day: '',
    month: '',
    year: '',
    position: '',
    applyLink: '',
  });
  
  const { data: session } = useSession(); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error1, setError1] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deji = () => {
    return (
      <>
        <div className="flex flex-col items-center justify-center">
          <Image src={upload} alt='upload' className='mb-5 max-lg:mb-2 max-lg:size-[10px]'/>

          <p className="mb-2 text-[16px] max-lg:text-[6px] font-[900] text-center">Drag & Drop or <span className="font-[400] text-[#3777FF] gilroy">Choose file</span> to upload</p>
          <span className="text-[14px] font-[400] text-center max-lg:text-[6px]">Supported formats: JPG, JPEG, PNG, PDF</span>
        </div>
      </>
    )
  }
  const [fileName, setFileName] = useState(deji);
  const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && ["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      setFileName(file.name);
      setFile(file);
    } else {
      setFileName("Unsupported file format");
      setFile(null);
    }
  };  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle rich text editor changes separately
  const handleDescriptionChange = (content) => {
    setFormData((prevData) => ({ ...prevData, description: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Convert image file to base64 if it exists
      let imageData = null;
      if (file) {
        const reader = new FileReader();
        imageData = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }

      // Only include deadline if all date fields are filled
      let deadline = null;
      if (formData.year && formData.month && formData.day) {
        deadline = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;
      }

      const response = await fetch('/api/opportunities/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institutionName: formData.institution,
          title: formData.title,
          description: formData.description,
          link: formData.applyLink,
          deadline,
          position: formData.position,
          type: formData.type,
          createdBy: session?.user?.id,
          image: imageData,
        }),
      });

      if (response.ok) {
        setSuccess('Opportunity submitted successfully!');
        toast.success('Opportunity submitted successfully!');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit opportunity');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isSubmitting) {
    return <LoadingSpinner />;
  }

  // Custom Quill modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  return (
    <>
      <div className='my-10 flex items-center justify-center max-lg:px-6'>
        <div className="lg:w-[1010px] lg:gap-[60px] border border-[#DCDEE1] subcard rounded-[30px] lg:p-[60px] max-lg:gap-8 max-lg:p-8 flex-col flex items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className='text-black h2 mb-[30px] max-lg:mb-4 text-center'>Submit an Opportunity</h2>
            <div className="w-[474px] max-lg:w-full text-center">
              <p className="bt2 text-black mb-5 max-lg:mb-2">Looking to hire? Submit an opportunity so our undergraduates can apply for the position.</p>
              <p className="bt2 text-black">Found an opportunity you think would be beneficial to our undergraduate? Share here.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className='w-full flex flex-col gap-7 max-lg:gap-6'>
            <div className=''>
              <label className='block mb-1 h4'>Company Name</label>
              <input
                type='text'
                name='institution'
                value={formData.institution}
                onChange={handleChange}
                placeholder='Enter Company Name'
                className='w-full px-5 py-[15px] max-lg:p-3 max-lg:placeholder:text-[10px] max-lg:text-[10px] border focus:outline-none focus:ring-accent focus:border-accent placeholder:text-[#403D39CC] text-[#403D39CC] border-[#DCDEE1] rounded-[8px]'
              />
            </div>
            <div className=''>
              <label className='block mb-1 h4'>Opportunity Title</label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleChange}
                placeholder='Enter Opportunity Title'
                className='w-full px-5 py-[15px] max-lg:p-3 max-lg:placeholder:text-[10px] max-lg:text-[10px] border focus:outline-none focus:ring-accent focus:border-accent placeholder:text-[#403D39CC] text-[#403D39CC] border-[#DCDEE1] rounded-[8px]'
              />
            </div>
            <div className=''>
              <label className='block mb-1 h4'>Opportunity Deadline</label>
              <div className="flex gap-[22px]">
                <input
                  type=''
                  name='day'
                  placeholder='DD'
                  value={formData.day}
                  onChange={handleChange}
                  className='max-lg:w-[60px] lg:w-[103px] px-5 py-[15px] max-lg:p-3 max-lg:placeholder:text-[10px] max-lg:text-[10px] border focus:outline-none focus:ring-accent focus:border-accent placeholder:text-[#403D39CC] text-[#403D39CC] border-[#DCDEE1] rounded-[8px]'
                  min="1"
                  max="31"
                />
                <input
                  type=''
                  name='month'
                  placeholder='MM'
                  value={formData.month}
                  onChange={handleChange}
                  className='max-lg:w-[60px] lg:w-[103px] px-5 py-[15px] max-lg:p-3 max-lg:placeholder:text-[10px] max-lg:text-[10px] border focus:outline-none focus:ring-accent focus:border-accent placeholder:text-[#403D39CC] text-[#403D39CC] border-[#DCDEE1] rounded-[8px]'
                  min="1"
                  max="12"
                />
                <input
                  type=''
                  name='year'
                  placeholder='YYYY'
                  value={formData.year}
                  onChange={handleChange}
                  className='max-lg:w-[60px] lg:w-[103px] px-5 py-[15px] max-lg:p-3 max-lg:placeholder:text-[10px] max-lg:text-[10px] border focus:outline-none focus:ring-accent focus:border-accent placeholder:text-[#403D39CC] text-[#403D39CC] border-[#DCDEE1] rounded-[8px]'
                />
              </div>
            </div>
            <div className=''>
              <label className='block mb-1 h4'>Type of Opportunity</label>
              <select
                name='type'
                value={formData.type}
                onChange={handleChange}
                className='w-full px-5 py-[15px] max-lg:p-3 max-lg:placeholder:text-[10px] max-lg:text-[10px] border focus:outline-none focus:ring-accent focus:border-accent placeholder:text-[#403D39CC] text-[#403D39CC] border-[#DCDEE1] rounded-[8px]'
              >
                <option value='internship'>Internship</option>
                <option value='scholarship'>Scholarship</option>
                <option value='volunteer'>Volunteer</option>
                <option value='ambassadorship'>Ambassadorship</option>
                <option value='training'>Training</option>
                <option value='job'>Job</option>
              </select>
            </div>
            <div className=''>
              <label className='mb-1 flex gap-2 items-center'>
                <span className='h4'>Position of Opportunity</span>
                <span className='italic max-md:hidden text-slate-500 font-[300] text-[12px]'>e.g: Msc, Bsc, Intern, etc.</span>
              </label>
              <input
                type='text'
                name='position'
                value={formData.position}
                onChange={handleChange}
                placeholder='Enter Opportunity Position'
                className='w-full px-5 py-[15px] max-lg:p-3 max-lg:placeholder:text-[10px] max-lg:text-[10px] border focus:outline-none focus:ring-accent focus:border-accent placeholder:text-[#403D39CC] text-[#403D39CC] border-[#DCDEE1] rounded-[8px]'
              />
            </div>
            <div className=''>
              <label className='block mb-1 h4'>Link to Opportunity</label>
              <input
                type='text'
                name='applyLink'
                value={formData.applyLink}
                onChange={handleChange}
                placeholder='Enter link to opportunity'
                className='w-full px-5 py-[15px] max-lg:p-3 max-lg:placeholder:text-[10px] max-lg:text-[10px] border focus:outline-none focus:ring-accent focus:border-accent placeholder:text-[#403D39CC] text-[#403D39CC] border-[#DCDEE1] rounded-[8px]'
              />
            </div>
            <div className=''>
              <label className='block mb-1 h4'>Description</label>
              {mounted && (
                <ReactQuill
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={modules}
                  formats={formats}
                  placeholder='Enter a description for the opportunity'
                  className='rounded-[8px] border border-[#DCDEE1]'
                  theme="snow"
                />
              )}
              <p className="text-xs text-gray-500 mt-2">
                You can format text using the toolbar above. Add paragraphs, bullet points, emphasis, and more.
              </p>
            </div>
            <div className=''>
              <label className='block mb-1 h4'>Upload an Image(If applicable)</label>
              <input type="file" id="file" name="file" onChange={handleFileChange} className="hidden"/>
              <label htmlFor="file" className="flex bg-[#F4F8FF] cursor-pointer border-dashed border-2 max-lg:border-[0.5px] border-black px-[30px] max-lg:px-4 max-lg:py-3 max-lg:rounded-[4px] py-10 w-full rounded-[8px] flex-col items-center justify-center">
                <span className="text-[#212B36] text-[16px] font-[500]">{fileName}</span>
              </label>
            </div>
            <div className="flex items-center justify-center w-full">
              <button 
                type="submit" 
                className={`primarybtn text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? <span>Submitting</span> : 'Submit'}
              </button>
            </div>
            {error && <p className='text-red-500 mt-4'>{error}</p>}
            {success && <p className='text-green-500 mt-4'>{success}</p>}
          </form>
          <Toaster />
        </div>
      </div>
    </>
  );
};

export default SubmitOpportunity;