import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid'
import { ImCross } from "react-icons/im";
import axios from '../../api/axios.js';
import './Dropzone.css'

function Dropzone({ className }) {
    
    const [files, setFiles] = useState([])
    const [rejected, setRejected] = useState([])

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {

      if (acceptedFiles?.length) {
        setFiles(previousFiles => {
            const newFiles = acceptedFiles.filter(newFile => 
                !previousFiles.some(existingFile => existingFile.name === newFile.name)
            );
            return [
                ...previousFiles,
                ...newFiles.map(file =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                )
            ];
        });
      }

      if(rejectedFiles?.length){
          setRejected(previousFiles => [
              ...previousFiles,
              ...rejectedFiles
          ])
      }
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({ 
        onDrop,
        accept: {
            'video/*': []
        },
    })

    const removeFile = name => {
        setFiles(files => files.filter(file => file.name !== name))
    }

    const removeAll = () => {
      setFiles([])
      setRejected([])
    }

    const removeRejected = name => {
        setRejected(files => files.filter(({ file }) => file.name !== name))
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
  
      if (!files?.length) {
        alert("No files uploaded")
        return
      }
  
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      try{
        const response = await axios.post('/upload', formData)

        if (response.status === 200){
          removeAll()
          alert('Successful Upload')
        }else{
          alert('some other error')
        }
      }catch(err){
        if (err.response && err.response.data && err.response.data.message) {
          const errorMessage = `Error ${err.response.status}: ${err.response.data.message}`;
          alert(errorMessage);
        } else {
          console.error(err);
        }
      }

      //make post request to aws s3

      // formData.append('upload_preset', 'friendsbook')
  
      // const URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL
      // const data = await fetch(URL, {
      //   method: 'POST',
      //   body: formData
      // }).then(res => res.json())
  
      // console.log(data)


      // Go to next page to do configure things to do with the videos uploaded
      // navigate('/main')
    }

    return (
        <form onSubmit={handleSubmit} className='dropzone-form'>
          <div {...getRootProps({
              className: className,
              style: { 
                borderWidth: '4px', 
                height: '400px',
                borderRadius: '20px'
              }
          })}>
            <input {...getInputProps()} />
            <div>
              <ArrowUpTrayIcon />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag & drop files here, or click to select files</p>
              )}
            </div>
          </div>

          <section className='below-dropzone'>
            <div className='dropzone-buttons'>
              <button
                type='button'
                onClick={removeAll}
                className='remove-button'
              >
                Remove all files
              </button>
              <button
                type='submit'
                className='upload-button'
              >
                Upload Files
              </button>
            </div>

            <h3 className='accepted-title'>Accepted Files</h3>
            <ul className='accepted-list'>
              {files.map(file => (
                <li className='accepted-card'>
                  <button
                    type='button'
                    className='x-button'
                    onClick={() => removeFile(file.name)}
                  >
                    <ImCross className='text-danger' style={{ fontSize: '16px' }} />
                  </button>
                  <p className=''>
                      {file.name}
                  </p>
                </li>
              ))}
            </ul>

            <h3 className='rejected-title'>Rejected Files</h3>
            <ul className='reject-list'>
              {rejected.map(({ file, errors }) => (
                <li key={file.name} className=''>
                  <button
                    type='button'
                    className='x-button'
                    onClick={() => removeRejected(file.name)}
                  >
                    <ImCross className='text-danger' style={{ fontSize: '16px' }} />
                  </button>
                  <div>
                    <p className=''>
                      {file.name}
                    </p>
                    <ul className=''>
                      {errors.map(error => (
                        <li key={error.code}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </form>
    )
}

export default Dropzone