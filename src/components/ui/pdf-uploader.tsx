import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FiUpload } from "react-icons/fi"

interface PdfUploadProps {
  value: File | undefined
  onChange: (value: File) => void
  className?: string
}

export function PdfUploader({ value, onChange, className }: PdfUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        onChange(file)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 bg-default-900 border-dashed rounded-md cursor-pointer flex flex-col items-center justify-center ${className}`}
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground">Uploaded File:</p>
          <p className="font-semibold text-foreground">{value.name}</p>
        </div>
      ) : (
        <div className="text-center p-4">
          <FiUpload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {isDragActive ? "Drop the PDF here" : "Drag 'n' drop a PDF here, or click to select one"}
          </p>
        </div>
      )}
    </div>
  )
}
