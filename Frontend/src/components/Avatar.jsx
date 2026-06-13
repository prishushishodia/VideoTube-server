const Avatar = ({ src, size = "w-10 h-10" }) => {
  return (
    <img
      src={src}
      alt="Avatar"
      className={`rounded-full object-cover ${size}`}
    />
  );
};

export default Avatar;
