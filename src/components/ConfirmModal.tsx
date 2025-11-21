import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

type ConfirmModalProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  cancelLabel?: string;
};

export function ConfirmModal({
  triggerLabel,
  title,
  description,
  component,
  cancelLabel = "닫기",
}: ConfirmModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-transparent text-gray-400">{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent className="h-5/6 overflow-scroll scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="mt-5 ml-8 text-2xl">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div>{component}</div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
