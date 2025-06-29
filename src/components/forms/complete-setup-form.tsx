import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function CompleteSetupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Complete your gym profile</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Tell us more about your fitness business to proceed.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="gymName">Gym Name</Label>
          <Input id="gymName" placeholder="" required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="gymName">Gym Address</Label>
          <Input id="gymName" placeholder="" required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="gymName">Phone Number</Label>
          <Input id="gymName" placeholder="" required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="gymName">Gym Type</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full hover:scale-105"
          size={"lg"}
          onClick={() => {
            showSuccess("Success", "Successfully completed profile");
            navigate("/dashboard");
          }}
        >
          Complete profile
        </Button>
      </div>
    </form>
  );
}
