export type ActivityColorName =
  | "green"
  | "blue"
  | "orange"
  | "purple"
  | "red"
  | "gray";

export type ActivityColorClasses = {
  iconBackground: string;
  iconText: string;
  accent: string;
};

const activityColorClasses: Record<
  ActivityColorName,
  ActivityColorClasses
> = {
  green: {
    iconBackground: "bg-neutral-100",
    iconText: "text-green-700",
    accent: "bg-green-500",
  },
  blue: {
    iconBackground: "bg-neutral-100",
    iconText: "text-blue-700",
    accent: "bg-blue-500",
  },
  orange: {
    iconBackground: "bg-neutral-100",
    iconText: "text-amber-700",
    accent: "bg-amber-500",
  },
  purple: {
    iconBackground: "bg-neutral-100",
    iconText: "text-purple-700",
    accent: "bg-purple-500",
  },
  red: {
    iconBackground: "bg-neutral-100",
    iconText: "text-red-700",
    accent: "bg-red-500",
  },
  gray: {
    iconBackground: "bg-neutral-100",
    iconText: "text-neutral-600",
    accent: "bg-neutral-400",
  },
};

export function normalizeActivityColor(
  value: string
): ActivityColorName {
  if (
    value === "green" ||
    value === "blue" ||
    value === "orange" ||
    value === "purple" ||
    value === "red"
  ) {
    return value;
  }

  return "gray";
}

export function getActivityColorClasses(
  color: ActivityColorName
) {
  return activityColorClasses[color];
}
