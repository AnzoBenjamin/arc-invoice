import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/use-redux-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import { forgot } from '@/lib/actions/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState(0)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(forgot({ email }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)

  const renderStep0 = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  )

  const renderStep1 = () => (
    <Alert>
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        A password reset link has been sent to your email. Please follow the link to reset your password.
      </AlertDescription>
      <div className="mt-4 flex justify-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/')}>Back to home</Button>
        <Button variant="outline" onClick={() => setStep(0)}>Resend link</Button>
      </div>
    </Alert>
  )

  const renderStep2 = () => (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Please check your internet connection and try again.
      </AlertDescription>
      <div className="mt-4 flex justify-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/')}>Back to home</Button>
        <Button variant="outline" onClick={() => setStep(0)}>Try again</Button>
      </div>
    </Alert>
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 0 && renderStep0()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </CardContent>
      </Card>
    </div>
  )
}