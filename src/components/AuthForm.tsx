'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Input, 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Divider,
} from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  onSubmit: (
    action: "login" | "signup",
    formData: FormData
  ) => Promise<{
    success: boolean;
    errors?: { email?: string[]; password?: string[]; general?: string[] };
    remainingAttempts: number;
  }>;
  initialRemainingAttempts: number;
}

export default function AuthForm({ onSubmit, initialRemainingAttempts }: AuthFormProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
    general?: string[];
  }>({});
  const [remainingAttempts, setRemainingAttempts] = useState(initialRemainingAttempts);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (action: "login") => {
    setErrors({});
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await onSubmit(action, formData);
      if (result && !result.success && result.errors) {
        setErrors(result.errors);
        setRemainingAttempts(result.remainingAttempts);
      } else {
        router.push("/private");
        router.refresh();
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setErrors({ general: ["An unexpected error occurred. Please try again."] });
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
    // Clear the error for the field being typed in
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Login or Sign Up</p>
          <p className="text-small text-default-500">Enter your credentials</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit("login"); }}>
          <div className="flex flex-col gap-4">
            <Input
              isRequired
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              errorMessage={errors.email && errors.email[0]}
              color={errors.email ? "danger" : "default"}
              onClear={() => setEmail("")}
            />
            <Input
              isRequired
              label="Password"
              placeholder="Enter your password"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              errorMessage={errors.password && errors.password[0]}
              color={errors.password ? "danger" : "default"}
            />
            <p className="text-small text-default-500">
              Remaining attempts: {remainingAttempts}
            </p>
            {errors.general && (
              <p className="text-danger">{errors.general[0]}</p>
            )}
            <div className="flex gap-2 justify-end">
              <Button fullWidth color="primary" type="submit">
                Login
              </Button>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}