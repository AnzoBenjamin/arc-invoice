import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from 'lucide-react'

interface FieldProps {
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  half?: boolean
  autoFocus?: boolean
  type: string
  placeholder?: string
}

export default function Field({ 
  name, 
  onChange, 
  label, 
  half = false, 
  autoFocus = false, 
  type, 
  placeholder 
}: FieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={`${half ? 'w-1/2' : 'w-full'} mb-4`}>
      <Label htmlFor={name} className="mb-2 block">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required
          autoFocus={autoFocus}
          type={name === 'password' ? (showPassword ? 'text' : 'password') : type}
          className="w-full"
        />
        {name === 'password' && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? 'Hide password' : 'Show password'}
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}