interface RatingProps {
  value: number;
  size?: number | string;}


export default function Rating({ value, size = "5vw" }: RatingProps) {
  const r = 12.5;
  const circumference = 2 * Math.PI * r;
  const percent = value / 5;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle
        cx="25"
        cy="25"
        r={r}
        fill="white"
        stroke="black"
        strokeWidth="1"
      />
      <circle
        cx="25"
        cy="25"
        r={r}
        fill="white"
        stroke="green"
        strokeWidth="1"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={circumference * (1 - percent)}
        strokeLinecap="round"
        transform="rotate(-90 25 25)"
      />
      <text
        x="25"
        y="26"
        fill="black"
        fontSize="12"
        alignmentBaseline="middle"
        textAnchor="middle"
      >
        {value}
      </text>
    </svg>
  );
}
