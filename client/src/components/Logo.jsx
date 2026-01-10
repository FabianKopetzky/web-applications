export default function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 60"
      width={200}
      height={60}
    >
      <text x={0} y={40} fontFamily="Arial, sans-serif" fontSize={40} fill="#2C9AB7">
        T
      </text>
      <path d="M20 30 L30 45 L45 15" stroke="#2C9AB7" strokeWidth={5} fill="none" />
      <text x={50} y={40} fontFamily="Arial, sans-serif" fontSize={40} fill="#B3D234">
        Due
      </text>
    </svg>
  );
}
