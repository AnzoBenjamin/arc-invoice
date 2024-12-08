import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { 
  Briefcase, 
  MapPin, 
  Phone, 
  Mail, 
  Wallet 
} from "lucide-react"
import { BusinessProfile } from "@/lib/types/profile-types"


interface ProfileDetailProps {
  profile: BusinessProfile
}

export function ProfileDetail({ profile }: ProfileDetailProps) {
  const details = [
    { icon: Briefcase, label: "Business Name", value: profile.businessName },
    { icon: MapPin, label: "Address", value: profile.contactAddress },
    { icon: Phone, label: "Phone", value: profile.phoneNumber },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Wallet, label: "Payment Details", value: profile.paymentDetails },
  ]

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex justify-center pb-2">
        <Avatar className="w-24 h-24">
          <AvatarImage src={profile.logo} alt={profile.businessName} />
          <AvatarFallback>{profile?.businessName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          {details.map((detail) => (
            <div key={detail.label} className="flex items-center">
              <dt className="flex items-center w-1/3 text-sm font-medium text-gray-500">
                <detail.icon className="w-5 h-5 mr-2" />
                {detail.label}
              </dt>
              <dd className="w-2/3 text-sm text-gray-900">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}