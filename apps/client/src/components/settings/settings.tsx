import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ProfileForm from '@/components/settings/form/profile-form'

export default function SettingsPage() {


  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <p className="text-center text-gray-800 mt-2 text-xl">Edit/update your business profile</p>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}