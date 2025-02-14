import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";


export default function Home() {
  return (
    <div className="m-4">
      <SignedOut>
        <SignInButton mode="modal" >
          <Button>SignIn</Button>
        </SignInButton>

      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
      <Button variant={"outline"}>Click Me</Button>
      <ModeToggle />
    </div>
  );
}
