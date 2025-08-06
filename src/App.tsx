# Replace App.tsx with valid code
cat > src/App.tsx << 'EOF'
import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Application Restored</h1>
    </div>
  );
}

export default App;
EOF