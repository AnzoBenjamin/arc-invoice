import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"

export interface UploaderProps {
  onUploadComplete: (url: string) => void;
  defaultValue?: string;
}

export const Uploader: React.FC<UploaderProps> = ({ onUploadComplete }) => {
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const url = "https://api.cloudinary.com/v1_1/almpo/image/upload"
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "invoice")

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      setProgress(100)
      const data = await response.json()
      onUploadComplete(data.secure_url)
    } catch (error) {
      console.error("Upload error:", error)
      setProgress(0)
    }
  }, [onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
  })

  return (
    <Card>
      <CardContent>
        <div
          {...getRootProps()}
          className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
            isDragActive ? "border-primary" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {isDragActive
                ? "Drop the file here"
                : "Drag 'n' drop a file here, or click to select a file"}
            </p>
          </div>
        </div>
        {progress > 0 && (
          <Progress value={progress} className="w-full mt-4" />
        )}
      </CardContent>
    </Card>
  )
}