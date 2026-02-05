import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useCreateAdminMutation } from "../services";
import type { Admin } from "../types";

const createAdminSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
});

type CreateAdminFormValues = yup.InferType<typeof createAdminSchema>;

type CreateAdminDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  viewAdmin?: Admin | null;
  onViewClose?: () => void;
};

export function CreateAdminDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  viewAdmin,
  onViewClose,
}: CreateAdminDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { showSuccess, showError } = useToast();
  const { mutateAsync: createAdmin, isPending } = useCreateAdminMutation();

  const isViewMode = viewAdmin != null;
  const open = isViewMode || (controlledOpen ?? internalOpen);
  const setOpen = (value: boolean) => {
    if (!value) {
      onViewClose?.();
      if (controlledOpen === undefined) setInternalOpen(false);
      controlledOnOpenChange?.(false);
    } else {
      if (controlledOpen === undefined) setInternalOpen(true);
      controlledOnOpenChange?.(true);
    }
  };

  const form = useForm<CreateAdminFormValues>({
    resolver: yupResolver(createAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (open && viewAdmin) {
      form.reset({
        email: viewAdmin.email,
        firstName: viewAdmin.firstName,
        lastName: viewAdmin.lastName,
        phoneNumber: viewAdmin.phoneNumber ?? "",
        password: "",
      });
    }
  }, [open, viewAdmin, form]);

  const onSubmit = async (data: CreateAdminFormValues) => {
    try {
      await createAdmin(data);
      showSuccess("Success", "Admin created successfully");
      form.reset();
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create admin. Please try again.";
      showError("Error", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Create Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isViewMode ? "View Admin" : "Create Admin"}</DialogTitle>
          <DialogDescription>
            {isViewMode
              ? "Admin account details."
              : "Create a new system admin account."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        readOnly={isViewMode}
                        className={isViewMode ? "bg-muted" : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        readOnly={isViewMode}
                        className={isViewMode ? "bg-muted" : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@activehive.com"
                      {...field}
                      readOnly={isViewMode}
                      className={isViewMode ? "bg-muted" : undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isViewMode && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1234567890"
                      {...field}
                      value={field.value || ""}
                      readOnly={isViewMode}
                      className={isViewMode ? "bg-muted" : undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {isViewMode ? (
                <Button type="button" onClick={() => setOpen(false)}>
                  Close
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create Admin"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
