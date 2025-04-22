import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FiUpload } from "react-icons/fi"

interface ImageUploadProps {
  value: string | undefined
  onChange: (value: string) => void
  className?: string
}

export function ImageUploader({ value, onChange, className }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 bg-default-900 border-dashed rounded-md cursor-pointer flex items-center justify-center ${className}`}
    >
      <input {...getInputProps()} />
      {value ? (
        <img src={value} alt="Uploaded" className="w-full h-full object-cover rounded-md" />
      ) : (
        <div className="text-center p-4">
          <FiUpload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {isDragActive ? "Drop the image here" : "Drag 'n' drop an image here, or click to select one"}
          </p>
        </div>
      )}
    </div>
  )
}

