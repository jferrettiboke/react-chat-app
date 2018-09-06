import Avatar from "./ui/Avatar";

export default ({ direction, text, author }) => (
  <div
    style={{
      transform: direction === "incoming" && "scaleX(-1)"
    }}
  >
    <div className="flex justify-end my-4">
      <div className="flex items-end justify-end md:w-3/5 lg:2/5">
        <div className="mr-3">
          <div
            className="text-xs text-grey mb-1 mx-3"
            style={{
              transform: direction === "incoming" && "scaleX(-1)"
            }}
          >
            {author}
          </div>
          <div
            className={[
              "p-3 py-2 leading-normal text-sm",
              direction === "incoming"
                ? "bg-grey-lighter"
                : "gradient-primary text-white"
            ].join(" ")}
            style={{
              borderRadius: 10,
              transform: direction === "incoming" && "scaleX(-1)"
            }}
          >
            {text}
          </div>
        </div>
        <div className="mr-2">
          <Avatar
            initials={author}
            style={{
              transform: direction === "incoming" && "scaleX(-1)"
            }}
          />
        </div>
      </div>
    </div>
  </div>
);
