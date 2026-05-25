export default function DashboardLoading() {
  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ width: 160, height: 28, background: "rgba(var(--card-rgb), 0.6)", borderRadius: 8 }} />
          <div style={{ width: 240, height: 14, background: "rgba(var(--card-rgb), 0.4)", borderRadius: 6, marginTop: 8 }} />
        </div>
        <div style={{ width: 240, height: 36, background: "rgba(var(--card-rgb), 0.6)", borderRadius: 10 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ padding: 20, background: "rgba(var(--card-rgb), 0.4)", borderRadius: 16, height: 140 }}>
            <div style={{ width: "60%", height: 12, background: "rgba(var(--card-rgb), 0.5)", borderRadius: 6 }} />
            <div style={{ width: "40%", height: 32, background: "rgba(var(--card-rgb), 0.5)", borderRadius: 6, marginTop: 16 }} />
            <div style={{ width: "50%", height: 12, background: "rgba(var(--card-rgb), 0.4)", borderRadius: 6, marginTop: 12 }} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[1, 2].map((i) => (
          <div key={i} style={{ padding: 20, background: "rgba(var(--card-rgb), 0.4)", borderRadius: 16, height: 300 }}>
            <div style={{ width: 100, height: 14, background: "rgba(var(--card-rgb), 0.5)", borderRadius: 6 }} />
            <div style={{ width: "85%", height: 200, background: "rgba(var(--card-rgb), 0.3)", borderRadius: 10, marginTop: 20 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
