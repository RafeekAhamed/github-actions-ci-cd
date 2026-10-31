import './App.css'

const pipelineStages = [
  { name: 'Source', tool: 'GitHub', status: 'Waiting', icon: '01' },
  { name: 'Build', tool: 'Vite', status: 'Waiting', icon: '02' },
  { name: 'Code Quality', tool: 'Oxlint', status: 'Waiting', icon: '03' },
  { name: 'Test', tool: 'Automated Tests', status: 'Waiting', icon: '04' },
  { name: 'Containerize', tool: 'Docker', status: 'Waiting', icon: '05' },
  { name: 'Deploy', tool: 'Deployment', status: 'Waiting', icon: '06' },
]

const technologies = [
  'React',
  'Vite',
  'Node.js',
  'GitHub Actions',
  'Docker',
  'Docker Hub',
]

function App() {
  return (
    <div className="dashboard">

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">D</div>
          <div>
            <h2>DevOpsHub</h2>
            <span>CI/CD PLATFORM</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="navigation">
          <a className="nav-item active" href="#overview">
            <span>▦</span> Overview
          </a>
          <a className="nav-item" href="#pipeline">
            <span>⇄</span> Pipelines
          </a>
          <a className="nav-item" href="#build">
            <span>⚙</span> Builds
          </a>
          <a className="nav-item" href="#deployment">
            <span>◈</span> Deployments
          </a>
          <a className="nav-item" href="#technology">
            <span>▤</span> Technologies
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="environment">
            <span className="status-dot"></span>
            Local Environment
          </div>
          <p>DevOps Portfolio Project 01</p>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / Overview</span>
            <h1>CI/CD Dashboard</h1>
          </div>

          <div className="profile">
            <div className="profile-avatar">RA</div>
            <div>
              <strong>DevOps Engineer</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <section className="welcome" id="overview">
          <div>
            <span className="eyebrow">PROJECT 01 / AUTOMATION</span>
            <h2>Continuous Integration & Delivery</h2>
            <p>
              Monitor application builds, automated tests,
              containerization and deployment workflows.
            </p>
          </div>

          <div className="pipeline-badge">
            <span className="status-dot"></span>
            Awaiting First Pipeline Run
          </div>
        </section>

        <section className="metrics">

          <article className="metric-card">
            <span className="metric-label">Pipeline Runs</span>
            <h2>0</h2>
            <span className="metric-note">No executions yet</span>
          </article>

          <article className="metric-card">
            <span className="metric-label">Successful Builds</span>
            <h2>0</h2>
            <span className="metric-note">Awaiting CI workflow</span>
          </article>

          <article className="metric-card">
            <span className="metric-label">Failed Builds</span>
            <h2>0</h2>
            <span className="metric-note">No build failures recorded</span>
          </article>

          <article className="metric-card">
            <span className="metric-label">Deployment Status</span>
            <h2 className="pending-text">Pending</h2>
            <span className="metric-note">Deployment not configured</span>
          </article>

        </section>

        <section className="content-grid">

          <article className="panel pipeline-panel" id="pipeline">
            <div className="panel-header">
              <div>
                <h3>Pipeline Workflow</h3>
                <p>Automated delivery lifecycle</p>
              </div>
              <span className="tag">CI/CD</span>
            </div>

            <div className="pipeline-list">

              {pipelineStages.map((stage) => (
                <div className="pipeline-stage" key={stage.name}>
                  <div className="stage-number">{stage.icon}</div>

                  <div className="stage-details">
                    <strong>{stage.name}</strong>
                    <span>{stage.tool}</span>
                  </div>

                  <span className="stage-status">
                    {stage.status}
                  </span>
                </div>
              ))}

            </div>
          </article>

          <article className="panel deployment-panel" id="deployment">
            <div className="panel-header">
              <div>
                <h3>Deployment Environments</h3>
                <p>Application deployment status</p>
              </div>
            </div>

            <div className="deployment-item">
              <div>
                <strong>Development</strong>
                <span>Local environment</span>
              </div>
              <span className="environment-tag">Ready</span>
            </div>

            <div className="deployment-item">
              <div>
                <strong>Staging</strong>
                <span>Pre-production</span>
              </div>
              <span className="pending-tag">Pending</span>
            </div>

            <div className="deployment-item">
              <div>
                <strong>Production</strong>
                <span>Live environment</span>
              </div>
              <span className="pending-tag">Pending</span>
            </div>

          </article>

        </section>

        <section className="panel technology-panel" id="technology">

          <div className="panel-header">
            <div>
              <h3>Technology Stack</h3>
              <p>Tools used in this CI/CD implementation</p>
            </div>
          </div>

          <div className="technology-list">
            {technologies.map((technology) => (
              <span className="technology-tag" key={technology}>
                {technology}
              </span>
            ))}
          </div>

        </section>

        <footer>
          <span>DevOpsHub · Project 01</span>
          <span>Built with React + Vite</span>
        </footer>

      </main>
    </div>
  )
}

export default App