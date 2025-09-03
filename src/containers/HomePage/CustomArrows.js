export const NextArrow = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props.style,
        display: "flex",
        alignItems: "center",
      }}
    >
      <i
        className="fa fa-chevron-right icon-hover"
        style={{ color: "gray", fontSize: 20, cursor: "pointer" }}
      />
    </div>
  );
};

export const PrevArrow = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props.style,
        display: "flex",
        alignItems: "center",
      }}
    >
      <i
        className="fa fa-chevron-left icon-hover"
        style={{ color: "gray", fontSize: 20, cursor: "pointer" }}
      />
    </div>
  );
};
