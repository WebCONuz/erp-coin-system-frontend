type Props = {
  title: string;
  description?: string;
};

export const DashboardTitle = ({ title, description }: Props) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
};
