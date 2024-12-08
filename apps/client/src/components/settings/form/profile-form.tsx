import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Uploader } from "@/components/custom/uploader";
import { getProfilesByUser, updateProfile } from "@/lib/actions/profile";
import { Building2, Mail, Phone, MapPin, CreditCard, User } from "lucide-react";
import { RootState } from "@/store";

const profileSchema = z.object({
  email: z.string().email(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  businessName: z.string().min(1, "Business name is required"),
  contactAddress: z.string().min(1, "Contact address is required"),
  paymentDetails: z.string().min(1, "Payment details are required"),
  logo: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
// Define the profile state interface
export interface ProfileState {
  profiles: profileTypes[];
  isLoading: boolean;
}

// Modify the type of the profile object to match the usage
export type profileTypes = {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  contactAddress: string;
  paymentDetails: string;
  logo?: string | undefined;
};

export interface UploaderProps {
  onUploadComplete: (url: string) => void;
  defaultValue?: string;
}
export interface ProfileState {
  profiles: profileTypes[];
  isLoading: boolean;
}

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  // In your component, update the selector
  const { profiles } = useAppSelector((state: RootState) => {
    // Ensure we're always returning an array of profileTypes
    const profilesState = state.profiles as ProfileState;
    console.log(profilesState)
    return {
      profiles: Array.isArray(profilesState.profiles)
        ? profilesState.profiles
        : [],
    };
  });
  const profile = profiles?.length > 0 ? profiles[0] : null;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "",
      phoneNumber: "",
      businessName: "",
      contactAddress: "",
      paymentDetails: "",
      logo: "",
    },
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("profile") || "{}");
    const userId = user?.result?._id || user?.result?.googleId;

    if (userId) {
      dispatch(getProfilesByUser(userId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      form.reset({
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        businessName: profile.businessName,
        contactAddress: profile.contactAddress,
        paymentDetails: profile.paymentDetails,
        logo: profile.logo,
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (profile && profile._id) {
      dispatch(updateProfile(profile?._id, data));
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {isEditing ? "Edit Profile" : "Business Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-8">
              <div className="flex justify-center">
                <Avatar className="w-40 h-40">
                  <AvatarImage src={profile.logo} alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileItem
                  icon={<User />}
                  label="Name"
                  value={profile.name}
                />
                <ProfileItem
                  icon={<Mail />}
                  label="Email"
                  value={profile.email}
                />
                <ProfileItem
                  icon={<Phone />}
                  label="Phone Number"
                  value={profile.phoneNumber}
                />
                <ProfileItem
                  icon={<Building2 />}
                  label="Business Name"
                  value={profile.businessName}
                />
                <ProfileItem
                  icon={<MapPin />}
                  label="Contact Address"
                  value={profile.contactAddress}
                />
                <ProfileItem
                  icon={<CreditCard />}
                  label="Payment Details"
                  value={profile.paymentDetails}
                />
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex justify-center mb-6">
                  <Uploader
                    onUploadComplete={(url) => form.setValue("logo", url)}
                    defaultValue={profile.logo}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="paymentDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Details</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!isEditing ? (
            <Button size="lg" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                Update Profile
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted">
      <div className="flex-shrink-0 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold">{value}</p>
      </div>
    </div>
  );
}
