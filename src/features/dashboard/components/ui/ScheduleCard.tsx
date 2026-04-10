type Props = {
  subject: string;
  teacher: string;
};

export const ScheduleCard = ({ subject, teacher }: Props) => {
  return (
    <div className="rounded-xl p-3 text-white bg-linear-to-br from-purple-500 to-indigo-600 shadow">
      <p className="text-sm font-medium">{subject}</p>
      <p className="text-xs opacity-80">Forobiy</p>

      <div className="mt-2 text-xs">
        <p>{teacher}</p>
        <p className="opacity-70">O‘qituvchi</p>
      </div>
    </div>
  );
};
