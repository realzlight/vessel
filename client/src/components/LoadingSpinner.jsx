import '../styles/LoadingSpinner.css'

export default function LoadingSpinner({ size = 32 }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" style={{ width: size, height: size }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="spinner-line"
            style={{ transform: `rotate(${i * 30}deg)`, animationDelay: `${i * (1 / 12)}s` }}
          />
        ))}
      </div>
    </div>
  )
}