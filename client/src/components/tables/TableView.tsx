import type { ReactNode } from "react";

interface TableFieldConfig {
  width: number;
}

type TableFields = Record<string, TableFieldConfig>;

interface TableViewProps {
  fields: TableFields;
  children: ReactNode;
}

export default function TableView({
  fields,
  children,
}: TableViewProps) {
  return (
    <div className="flex flex-wrap gap-16 justify-center p-32">
      {children}
    </div>
  );
}