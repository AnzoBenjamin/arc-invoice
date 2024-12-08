import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { createProfile } from "@/lib/actions/profile";
import { signup, signin } from "@/lib/actions/auth";
import LoginForm from "@/components/forms/login-form";
import SignupForm from "@/components/forms/signup-form";
import { useAppDispatch } from "@/hooks/use-redux-types";

type UserCredentials = {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
};

export default function Login() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (formData: UserCredentials, isSignup: boolean) => {
    setIsLoading(true);
    try {
      if (isSignup) {
        dispatch(signup(formData, setIsLoading, navigate));
      } else {
        dispatch(signin(formData, setIsLoading, navigate));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: "Authentication failed. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = jwtDecode(tokenResponse.access_token);
      dispatch(
        createProfile(
          {
            /*
            name: userInfo.name,
            email: userInfo.email,
            profilePicture: userInfo.picture,
            */
            userId: userInfo.sub,
          },
        )
      );
      navigate("/dashboard");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Google Sign In was unsuccessful. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <LoginForm
              onSubmit={(data) => handleSubmit(data, false)}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm
              onSubmit={(data) => handleSubmit(data, true)}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => googleLogin()}
        >
          Continue with Google
        </Button>
        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
