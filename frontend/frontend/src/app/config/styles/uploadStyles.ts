const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 400,
    margin: '2rem auto',
    padding: '1.5rem',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    border: '1px solid #ddd',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#000',
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  latestVersion: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#555',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
}

export default styles