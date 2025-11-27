import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function MissingSessionCard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 rounded-lg border border-dashed p-6 text-center">
      <h3 className="text-xl font-semibold">Finish Step 1 first</h3>
      <p className="text-muted-foreground text-sm">
        We can&apos;t find an active registration session. Complete the owner
        signup so we know which gym you&apos;re setting up.
      </p>
      <Button className="w-full" onClick={() => navigate("/signup")}>
        Go to signup
      </Button>
    </div>
  );
}
