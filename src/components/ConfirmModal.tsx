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
  component?: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void | Promise<void>;
};

export function ConfirmModal({
  triggerLabel,
  title,
  description,
  component,
  confirmLabel = "확인",
  cancelLabel = "닫기",
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-transparent text-gray-400">{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent className="h-fit ">
        <DialogHeader>
          <DialogTitle className="mt-5 ml-8 text-2xl">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-scroll scrollbar-hide">{component}</div>

        <DialogFooter>
          {/* 확인: 실행 후 닫기 */}
          <DialogClose asChild>
            <Button variant="outline" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </DialogClose>

          {/* 취소: 그냥 닫기 */}
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
