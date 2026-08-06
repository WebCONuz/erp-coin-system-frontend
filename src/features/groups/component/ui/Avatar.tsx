interface Props {
  fullName: string;
  avatarUrl?: string;
}
export const Avatar = ({ fullName, avatarUrl }: Props) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={fullName}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-sm text-white font-medium">
      {fullName?.charAt(0)}
      {fullName?.split(" ")?.[1]?.charAt(0)}
    </div>
  );
};
