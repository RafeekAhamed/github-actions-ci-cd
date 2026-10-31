import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('DevOpsHub Dashboard', () => {
  it('renders the dashboard heading', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'CI/CD Dashboard' }),
    ).toBeInTheDocument()
  })

  it('displays all pipeline stages', () => {
    render(<App />)

    const stages = [
      'Source',
      'Build',
      'Code Quality',
      'Test',
      'Containerize',
      'Deploy',
    ]

    stages.forEach((stage) => {
      expect(screen.getByText(stage)).toBeInTheDocument()
    })
  })

  it('displays deployment environments', () => {
    render(<App />)

    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Staging')).toBeInTheDocument()
    expect(screen.getByText('Production')).toBeInTheDocument()
  })

  it('displays the technology stack', () => {
    render(<App />)

    const technologySection = document.querySelector('#technology')
    const technology = within(technologySection)

    expect(technology.getByText('React')).toBeInTheDocument()
    expect(technology.getByText('Docker')).toBeInTheDocument()
    expect(technology.getByText('GitHub Actions')).toBeInTheDocument()
  })
})