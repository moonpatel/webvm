import React from "react";
import { Card } from "@radix-ui/themes";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  //   user: Pick<User, "id" | "name">;
}

export function UserNameForm({ className }: UserNameFormProps) {
  const [isSaving, _] = React.useState<boolean>(false);

  return (
    <form>
      <Card>
        <CardHeader>
          <CardTitle>Your Name</CardTitle>
          <CardDescription>
            Please enter your full name or a display name you are comfortable
            with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px]"
              size={32}
              //   {...register("name")}
            />
            {/* {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )} */}
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants(), className)}
            // disabled={isSaving}
            disabled={true}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  );
}
