import { ClassSelect, ScheduleCard } from "./ui";

const days = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
];

export const ScheduleGrid = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl">
      {/* select */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Dars Jadvali</h2>
        <ClassSelect
          options={[
            { label: "5A", value: "5a" },
            { label: "6A", value: "6a" },
          ]}
          onChange={() => {}}
        />
      </div>

      {/* scedule table  */}
      <div className="grid grid-cols-6 gap-4 mt-6">
        {days.map((day) => (
          <div key={day}>
            <p className="font-medium mb-2">{day}</p>

            <div className="space-y-3">
              <ScheduleCard subject="Matematika" teacher="Rahimova" />
              <ScheduleCard subject="Rus tili" teacher="Pulatova" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
