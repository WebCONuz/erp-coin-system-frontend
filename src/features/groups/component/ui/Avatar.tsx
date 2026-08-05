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
    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-500 font-medium border border-violet-500/40">
      {fullName.charAt(0)}
    </div>
  );
};
