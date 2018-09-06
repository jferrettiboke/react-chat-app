export default ({ src, initials, size, className, ...rest }) => {
  if (src) {
    return (
      <img
        className={[
          "rounded-full border-2 border-white",
          size === "small" && "w-6 h-6",
          size === "large" && "w-10 h-10",
          !size && "w-8 h-8",
          className
        ].join(" ")}
        src={src}
        alt="..."
        title={initials}
        {...rest}
      />
    );
  }

  if (initials) {
    return (
      <span
        className={[
          "rounded-full border-2 border-white bg-grey-light text-white font-bold flex justify-center items-center text-sm",
          size === "small" && "w-6 h-6",
          size === "large" && "w-10 h-10",
          !size && "w-8 h-8",
          className
        ].join(" ")}
        title={initials}
        {...rest}
      >
        {initials.charAt(0)}
      </span>
    );
  }

  return null;
};
