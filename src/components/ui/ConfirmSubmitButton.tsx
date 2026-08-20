"use client";

type ConfirmSubmitButtonProps = {
  children: React.ReactNode;
  confirmation: string;
  className?: string;
};

export function ConfirmSubmitButton({
  children,
  confirmation,
  className,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(confirmation)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
