import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

type ConfirmModalProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  confirmLabel?: string;
  cancelLabel: string;
  onConfirm?: () => void;
};

export function ConfirmModal({
  triggerLabel,
  title,
  description,
  component,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Dialog>
      {/* 열기 버튼 */}
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>

      {/* 모달 내용 */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{<>{description}</>}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
        {component}
      </DialogContent>
    </Dialog>
  );
}
